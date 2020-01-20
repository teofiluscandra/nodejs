/* eslint-disable no-const-assign */
/* eslint-disable max-len */
/*
* Worker related task
*
*/

// Depedencies
const http = require('http');
const https = require('https');
const url = require('url');
const util = require('util');
const _data = require('./data');
const _logs = require('./logs');

const debug = util.debuglog('workers');

// Instantiate the worker object
const workers = {};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
	// get all the checks
	_data.list('checks', (err, data) => {
		if (!err && data && data.length > 0) {
			data.forEach((check) => {
				_data.read('checks', check, (err, originalDataCheck) => {
					if (!err && originalDataCheck) {
						workers.validateCheckData(originalDataCheck);
					} else {
						debug('Error reading the data');
					}
				});
			});
		} else {
			debug('Error: Could not find any checks to process');
		}
	});
};

// Sanity-check the check data
workers.validateCheckData = (originalDataCheck) => {
	originalDataCheck = typeof (originalDataCheck) === 'object' && originalDataCheck != null ? originalDataCheck : {};
	originalDataCheck.id = typeof (originalDataCheck.id) === 'string' && originalDataCheck.id.trim().length === 20 ? originalDataCheck.id.trim() : false;
	originalDataCheck.userPhone = typeof (originalDataCheck.userPhone) === 'string' && originalDataCheck.userPhone.trim().length > 10 ? originalDataCheck.userPhone.trim() : false;
	originalDataCheck.protocol = typeof (originalDataCheck.protocol) === 'string' && ['http', 'https'].indexOf(originalDataCheck.protocol) > -1 ? originalDataCheck.protocol : false;
	originalDataCheck.url = typeof (originalDataCheck.url) === 'string' && originalDataCheck.url.trim().length > 0 ? originalDataCheck.url.trim() : false;
	originalDataCheck.method = typeof (originalDataCheck.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(originalDataCheck.method) > -1 ? originalDataCheck.method : false;
	originalDataCheck.successCodes = typeof (originalDataCheck.successCodes) === 'object' && originalDataCheck.successCodes instanceof Array && originalDataCheck.successCodes.length > 0 ? originalDataCheck.successCodes : false;
	originalDataCheck.timeoutSeconds = typeof (originalDataCheck.timeoutSeconds) === 'number' && originalDataCheck.timeoutSeconds % 1 === 0 && originalDataCheck.timeoutSeconds >= 1 && originalDataCheck.timeoutSeconds <= 5 ? originalDataCheck.timeoutSeconds : false;

	originalDataCheck.state = typeof (originalDataCheck.state) === 'string' && ['up', 'down'].indexOf(originalDataCheck.state) > -1 ? originalDataCheck.state : 'down';
	originalDataCheck.lastChecked = typeof (originalDataCheck.lastChecked) === 'number' && originalDataCheck.lastChecked > 0 ? originalDataCheck.lastChecked : false;

	// if all the checks pass, pass the data along to the next process
	if (originalDataCheck.id && originalDataCheck.userPhone && originalDataCheck.protocol && originalDataCheck.url && originalDataCheck.method && originalDataCheck.successCodes && originalDataCheck.timeoutSeconds) {
		workers.performCheck(originalDataCheck);
	} else {
		debug('Error: one the checks is not properly formatted');
	}
};

// Perform the check, send the originalDataCheck and the outcome of the check process, to the next step.
workers.performCheck = (originalDataCheck) => {
	const checkOutcome = {
		error: false,
		responseCode: false,
	};

	let outcomeSent = false;


	// parse the url
	const parseUrl = url.parse(`${originalDataCheck.protocol}://${originalDataCheck.url}`, true);
	const { hostname } = parseUrl;
	const { path } = parseUrl;

	const requestDetails = {
		protocol: `${originalDataCheck.protocol}:`,
		hostname,
		method: originalDataCheck.method.toUpperCase(),
		path,
		timeout: originalDataCheck.timeoutSeconds * 1000,
	};

	// Instantiate the request object
	const _moduleToUse = originalDataCheck.protocol === 'http' ? http : https;
	const req = _moduleToUse.request(requestDetails, (res) => {
		const status = res.statusCode;

		checkOutcome.responseCode = status;
		if (!outcomeSent) {
			workers.processCheckOutcome(originalDataCheck, checkOutcome);
			outcomeSent = true;
		}
	});

	// bind error
	req.on('error', (e) => {
		checkOutcome.error = {
			error: true,
			value: e,
		};
		if (!outcomeSent) {
			workers.processCheckOutcome(originalDataCheck, checkOutcome);
			outcomeSent = true;
		}
	});

	// bind timeout
	req.on('timeout', () => {
		checkOutcome.error = {
			error: true,
			value: 'timeout',
		};
		if (!outcomeSent) {
			workers.processCheckOutcome(originalDataCheck, checkOutcome);
			outcomeSent = true;
		}
	});

	// end of the request
	req.end();
};

// process the check outcome, update data as needed, trigger an alert if needed
// special logic for accommodating a check that has never been tested before

workers.processCheckOutcome = (originalDataCheck, checkOutcome) => {
	const state = !checkOutcome.error && checkOutcome.responseCode && originalDataCheck.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

	const alertWarranted = !!(originalDataCheck.lastChecked && originalDataCheck.state !== state);
	const newCheckData = originalDataCheck;
	newCheckData.state = state;
	newCheckData.lastChecked = Date.now();

	const timeOfCheck = Date.now();
	workers.log(originalDataCheck, checkOutcome, state, alertWarranted, timeOfCheck);

	// save
	_data.update('checks', newCheckData.id, newCheckData, (err) => {
		if (!err) {
			// send the new check
			if (alertWarranted) {
				workers.alertUserToStatusChange(newCheckData);
			} else {
				debug('Check outcome has not changed');
			}
		} else {
			debug('Error trying to save updates to one of the checks');
		}
	});
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = (newCheckData) => {
	const msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;
	debug(msg);
};

// Logging to files
workers.log = (originalDataCheck, checkOutcome, state, alertWarranted, timeOfCheck) => {
	const logData = {
		check: originalDataCheck,
		outcome: checkOutcome,
		state,
		alert: alertWarranted,
		time: timeOfCheck,
	};

	// Convert data to a string
	const logDataStr = JSON.stringify(logData);

	// determine the name of the log file
	const logFileName = originalDataCheck.id;

	// Append the log string to the file
	_logs.append(logFileName, logDataStr, (err) => {
		if (!err) {
			debug('Logging succeeded');
		} else {
			debug('Error Logging');
		}
	});
};

// Timer to execute the worker process once per minutes
workers.loop = () => {
	setInterval(() => {
		workers.gatherAllChecks();
	}, 1000 * 60);
};

// Rotate (compress) the log files
workers.rotateLogs = () => {
	// logs all the (non-compressed) log files
	_logs.list(false, (err, logs) => {
		if (!err && logs && logs.length > 0) {
			logs.forEach((logName) => {
				const logId = logName.replace('.log', '');
				const newFileId = `${logId}-${Date.now()}`;
				_logs.compress(logId, newFileId, (err) => {
					if (!err) {
						// Truncate the log
						_logs.truncate(logId, (err) => {
							if (!err) {
								debug('success truncating logFile');
							} else {
								debug('error truncating logFile');
							}
						});
					} else {
						debug('Error compressing one of the log files: ', err);
					}
				});
			});
		} else {
			debug('Could not finds logs to compressed');
		}
	});
};

// Timer to execute log rotation per day
workers.logRotationLoops = () => {
	setInterval(() => {
		workers.rotateLogs();
	}, 1000 * 60 * 60 * 24);
};

// init script
workers.init = () => {
	// Send to console, in yellow
	debug('\x1b[33m%s\x1b[0m', 'Background workers are running');

	// execute all the checks immediatelly
	workers.gatherAllChecks();

	// call the loop so the checks will execute later on
	workers.loop();

	// compress all the logs
	workers.rotateLogs();

	// call the compression loop so logs will be compressed later
	workers.logRotationLoops();
};

module.exports = workers;
