/**
 * API Test
 */

const assert = require('assert');
const http = require('http');
const app = require('../index');
const config = require('../lib/config');

const api = {};
const helpers = {};

helpers.makeGetRequest = (path, callback) => {
	const requestDetails = {
		protocol: 'http:',
		hostname: 'localhost',
		port: config.httpPort,
		method: 'GET',
		path,
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const req = http.request(requestDetails, (res) => {
		callback(res);
	});

	req.end();
};

// The main init() function should be able to run without throwing.
api['app.init should start without throwing'] = (done) => {
	assert.doesNotThrow(() => {
		app.init(() => {
			done();
		});
	}, TypeError);
};

// Make a request to /ping
api['/ping should respond to GET with 200'] = (done) => {
	helpers.makeGetRequest('/ping', (res) => {
		assert.equal(res.statusCode, 200);
		done();
	});
};

// Make a request to /api/users
api['/api/users should respond to GET with 400'] = function (done) {
	helpers.makeGetRequest('/api/users', (res) => {
		assert.equal(res.statusCode, 400);
		done();
	});
};

// Make a request to a random path
api['A random path should respond to GET with 404'] = function (done) {
	helpers.makeGetRequest('/this/path/shouldnt/exist', (res) => {
		assert.equal(res.statusCode, 404);
		done();
	});
};

// Export the tests to the runner
module.exports = api;
