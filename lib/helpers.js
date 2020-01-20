/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/*
*   Helpers for various task
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all helper
const helpers = {};

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

module.exports = helpers;
