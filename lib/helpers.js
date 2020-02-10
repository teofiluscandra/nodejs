/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/*
*   Helpers for various task
*/

// Dependencies
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const config = require('./config');

// Container for all helper
const helpers = {};

// get a number for test runner
helpers.getANumber = () => 1;

// create sha256 hash
helpers.hash = (str) => {
	if (typeof (str) === 'string' && str.length > 0) {
		const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	}
	return false;
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
	try {
		const obj = JSON.parse(str);
		return obj;
	} catch (e) {
		return {};
	}
};

// Create a random string
helpers.createRandomString = (strLength) => {
	strLength = typeof (strLength) === 'number' && strLength > 0 ? strLength : 0;
	if (strLength) {
		// define all posible character
		const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

		// start the final string
		let str = '';

		for (let i = 1; i <= strLength; i++) {
			const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
			str += randomCharacter;
		}

		return str;
	}
	return false;
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = (templateName, data, callback) => {
	templateName = typeof (templateName) === 'string' && templateName.length > 0 ? templateName : false;
	data = typeof (data) === 'object' && data !== null ? data : {};
	if (templateName) {
		const templatesDir = path.join(__dirname, '/../templates/');
		fs.readFile(`${templatesDir + templateName}.html`, 'utf8', (err, str) => {
			if (!err && str && str.length > 0) {
			// Do interpolation on the string
				const finalString = helpers.interpolate(str, data);
				callback(false, finalString);
			} else {
				callback('No template could be found');
			}
		});
	} else {
		callback('A valid template name was not specified');
	}
};

// Add the universal header and footer to a string, and pass provided data object to header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
	str = typeof (str) === 'string' && str.length > 0 ? str : '';
	data = typeof (data) === 'object' && data !== null ? data : {};
	// Get the header
	helpers.getTemplate('_header', data, (err, headerString) => {
		if (!err && headerString) {
		// Get the footer
			helpers.getTemplate('_footer', data, (err, footerString) => {
				if (!err && headerString) {
					// Add them all together
					const fullString = headerString + str + footerString;
					callback(false, fullString);
				} else {
					callback('Could not find the footer template');
				}
			});
		} else {
			callback('Could not find the header template');
		}
	});
};

// Take a given string and data object, and find/replace all the keys within it
helpers.interpolate = (str, data) => {
	str = typeof (str) === 'string' && str.length > 0 ? str : '';
	data = typeof (data) === 'object' && data !== null ? data : {};

	// Add the templateGlobals to the data object, prepending their key name with "global."
	for (const keyName in config.templateGlobals) {
		if (config.templateGlobals.hasOwnProperty(keyName)) {
			data[`global.${keyName}`] = config.templateGlobals[keyName];
		}
	}
	// For each key in the data object, insert its value into the string at the corresponding placeholder
	for (const key in data) {
		if (data.hasOwnProperty(key) && typeof (data[key] === 'string')) {
			const replace = data[key];
			const find = `{${key}}`;
			str = str.replace(find, replace);
		}
	}
	return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
	fileName = typeof (fileName) === 'string' && fileName.length > 0 ? fileName : false;
	if (fileName) {
		const publicDir = path.join(__dirname, '/../public/');
		fs.readFile(publicDir + fileName, (err, data) => {
			if (!err && data) {
				callback(false, data);
			} else {
				callback('No file could be found');
			}
		});
	} else {
		callback('A valid file name was not specified');
	}
};

module.exports = helpers;
