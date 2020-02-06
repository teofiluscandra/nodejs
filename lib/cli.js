/**
 * CLI relate task
 */

// Depedencies
const readline = require('readline');
const util = require('util');
const events = require('events');
const os = require('os');
const v8 = require('v8');

const debug = util.debuglog('cli');
const _data = require('./data');
const _log = require('./logs');
const helpers = require('./helpers');

class _events extends events {}
const e = new _events();

const cli = {};

// Input handlers
e.on('man', (str) => {
	cli.responders.help();
});

e.on('help', (str) => {
	cli.responders.help();
});

e.on('exit', (str) => {
	cli.responders.exit();
});

e.on('stats', (str) => {
	cli.responders.stats();
});

e.on('list users', (str) => {
	cli.responders.listUsers();
});

e.on('more user info', (str) => {
	cli.responders.moreUserInfo(str);
});

e.on('list checks', (str) => {
	cli.responders.listChecks(str);
});

e.on('more check info', (str) => {
	cli.responders.moreCheckInfo(str);
});

e.on('list logs', (str) => {
	cli.responders.listLogs();
});

e.on('more log info', (str) => {
	cli.responders.moreLogInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = () => {
	const commands = {
		man: 'Alias help',
		help: 'Show this help page',
		exit: 'Kill the CLI (and the rest of application)',
		stats: 'Get statistics on the underlying operation system and resourse util',
		'list users': 'Show a list of all the registered users in the system',
		'more user info --{userId}': 'Show details of a specifics user',
		'list checks --up --down': 'Show a list of all the active checks in the system, including their state. The --up and --down are optional',
		'more check info --{checkId}': 'Show details of a specified check',
		'list logs': 'Show all log files available to be read (compressed and uncompressed)',
		'more log info --{filename}': 'Show details of a specified log file',
	};

	// show a header
	cli.horizontalLine();
	cli.centered('CLI MANUAL');
	cli.horizontalLine();
	cli.verticalSpace(2);

	// show each command followed by its explaination
	Object.keys(commands).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(commands, key)) {
			const value = commands[key];
			let line = `\x1b[33m${key}\x1b[0m`;
			const padding = 60 - line.length;

			for (let i = 0; i < padding; i++) {
				line += ' ';
			}

			line += value;
			console.log(line);
			cli.verticalSpace();
		}
	});

	cli.verticalSpace(1);
	cli.horizontalLine();
};

cli.verticalSpace = (lines) => {
	lines = typeof (lines) === 'number' && lines > 0 ? lines : 1;
	for (let i = 0; i < lines; i++) {
		console.log('');
	}
};

cli.horizontalLine = () => {
	// get the available screen size
	const width = process.stdout.columns;
	let line = '';

	for (let i = 0; i < width; i++) {
		line += '-';
	}
	console.log(line);
};

cli.centered = (str) => {
	str = typeof (str) === 'string' && str.trim().length > 0 ? str.trim() : '';
	const width = process.stdout.columns;

	const leftPadding = Math.floor((width - str.length) / 2);
	let line = '';

	for (let i = 0; i < leftPadding; i++) {
		line += ' ';
	}
	line += str;

	console.log(line);
};

// exit
cli.responders.exit = () => {
	process.exit(0);
};

// stats
cli.responders.stats = () => {
	const stats = {
		'Load Average': os.loadavg().join(' '),
		'CPU Count': os.cpus().length,
		'Free Memory': os.freemem(),
		'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
		'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
		'Allocated Heap Use (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
		'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
		Uptime: `${os.uptime() / 60} Minutes`,
	};

	cli.horizontalLine();
	cli.centered('SYSTEM STATISTICS');
	cli.horizontalLine();
	cli.verticalSpace(2);

	Object.keys(stats).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(stats, key)) {
			const value = stats[key];
			let line = `\x1b[33m${key}\x1b[0m`;
			const padding = 60 - line.length;

			for (let i = 0; i < padding; i++) {
				line += ' ';
			}

			line += value;
			console.log(line);
			cli.verticalSpace();
		}
	});

	cli.verticalSpace(1);
	cli.horizontalLine();
};

// List users
cli.responders.listUsers = () => {
	_data.list('users', (err, userIds) => {
		if (!err && userIds && userIds.length > 0) {
			cli.verticalSpace();
			userIds.forEach((id) => {
				_data.read('users', id, (err, userData) => {
					if (!err && userData) {
						let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks:  `;
						const numberOfChecks = typeof (userData.checks) === 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
						line += numberOfChecks;
						console.log(line);
						cli.verticalSpace();
					}
				});
			});
		}
	});
};

// More user info
cli.responders.moreUserInfo = (str) => {
	const arr = str.split('--');
	const userId = typeof (arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

	if (userId) {
		_data.read('users', userId, (err, userData) => {
			if (!err && userData) {
				delete userData.hashedPassword;

				cli.verticalSpace();
				console.dir(userData, { colors: true });
				cli.verticalSpace();
			}
		});
	} else {
		cli.verticalSpace();
		console.log('User not exist');
		cli.verticalSpace();
	}
};

// List checks
cli.responders.listChecks = (str) => {
	_data.list('checks', (err, checkIds) => {
		if (!err && checkIds && checkIds.length > 0) {
			cli.verticalSpace();
			checkIds.forEach((checkId) => {
				_data.read('checks', checkId, (err, checkData) => {
					if (!err && checkData) {
						const includeCheck = false;
						const lowerString = str.toLowerCase();
						// Get the state, default to down
						const state = typeof (checkData.state) === 'string' ? checkData.state : 'down';
						// Get the state, default to unknown
						const stateOrUnknown = typeof (checkData.state) === 'string' ? checkData.state : 'unknown';
						// If the user has specified that state, or hasn't specified any state
						if ((lowerString.indexOf(`--${state}`) > -1) || (lowerString.indexOf('--down') === -1 && lowerString.indexOf('--up') === -1)) {
							const line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
							console.log(line);
							cli.verticalSpace();
						}
					}
				});
			});
		}
	});
};

// more check info
cli.responders.moreCheckInfo = (str) => {
	const arr = str.split('--');
	const checkId = typeof (arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
	if (checkId) {
		// Lookup the user
		_data.read('checks', checkId, (err, checkData) => {
			if (!err && checkData) {
				// Print their JSON object with text highlighting
				cli.verticalSpace();
				console.dir(checkData, { colors: true });
				cli.verticalSpace();
			}
		});
	}
};

// list logs
cli.responders.listLogs = () => {
	_log.list(true, (err, logFileNames) => {
		if (!err && logFileNames && logFileNames.length > 0) {
			cli.verticalSpace();
			logFileNames.forEach((logFileName) => {
				if (logFileName.indexOf('-') > -1) {
					console.log(logFileName);
					cli.verticalSpace();
				}
			});
		}
	});
};

// more logs info
cli.responders.moreLogInfo = (str) => {
	// Get logFileName from string
	const arr = str.split('--');
	const logFileName = typeof (arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
	if (logFileName) {
		cli.verticalSpace();
		// Decompress it
		_log.decompress(logFileName, (err, strData) => {
			if (!err && strData) {
				// Split it into lines
				const arr = strData.split('\n');
				arr.forEach((jsonString) => {
					const logObject = helpers.parseJsonToObject(jsonString);
					if (logObject && JSON.stringify(logObject) !== '{}') {
						console.dir(logObject, { colors: true });
						cli.verticalSpace();
					}
				});
			}
		});
	}
};

cli.processInput = (str) => {
	str = typeof (str) === 'string' && str.trim().length > 0 ? str.trim() : false;

	// only process the input if user write something
	if (str) {
		// codify the unique string that identify unique questions
		const uniqueInputs = [
			'man',
			'help',
			'exit',
			'stats',
			'list users',
			'more user info',
			'list checks',
			'more check info',
			'list logs',
			'more log info',
		];

		// go through the possible inputs
		let matchFound = false;
		const counter = 0;

		uniqueInputs.some((input) => {
			if (str.toLowerCase().indexOf(input) > -1) {
				matchFound = true;
				e.emit(input, str);
				return true;
			}
		});

		if (!matchFound) {
			console.log('sorry, try again');
		}
	}
};

cli.init = () => {
	console.log('\x1b[36m%s\x1b[0m', 'The CLI is running');
	const _interface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '',
	});

	// create an initial prompt
	_interface.prompt();

	// Handle each line of input separately
	_interface.on('line', (str) => {
		cli.processInput(str);

		_interface.prompt();
	});

	// if the user stop the cli, kill the process
	_interface.on('close', () => {
		process.kill(0);
	});
};

module.exports = cli;
