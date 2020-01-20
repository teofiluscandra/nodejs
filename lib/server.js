/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */

/*
* Server related task
*
*/

// Depedencies

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');
const util = require('util');
const config = require('./config');
const handlers = require('./handlers');
const helpers = require('./helpers');

const debug = util.debuglog('server');

// Instantiate the server module object
const server = {};

// Instantiate the HTTP Server
server.httpServer = http.createServer((req, res) => {
	server.unifiedServer(req, res);
});

// Instantiate the HTTPs Server
server.httpsServerOptions = {
	key: fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '/../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
	server.unifiedServer(req, res);
});

// All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
	// Get the URL and parse it
	const parsedUrl = url.parse(req.url, true);

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const method = req.method.toLowerCase();

	// Get query string as an object
	const queryStringObject = parsedUrl.query;

	// Get request header
	const { headers } = req;

	// Get payloads , id any
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});

	req.on('end', () => {
		buffer += decoder.end();

		// Choose the handler this request should go to. if one is not found, go to not found handlers.
		const chosenHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

		// Construct the data object to send to the handler
		const data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: helpers.parseJsonToObject(buffer),
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, (statusCode, payload) => {
			// use the status code callback by the handler, or default to 200
			statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
			// use the payload called back by the handler, or default to empty object
			payload = typeof (payload) === 'object' ? payload : {};

			// connect payload to a string
			const payloadString = JSON.stringify(payload);

			// return the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);


			// If the response is 200, print green, otherwise print red
			if (statusCode === 200) {
				debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			} else {
				debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			}
		});
	});
};

// Define a request router
server.router = {
	ping: handlers.ping,
	users: handlers.users,
	tokens: handlers.tokens,
	checks: handlers.checks,
};

// Init script
server.init = () => {
	// Start the HTTP server
	server.httpServer.listen(config.httpPort, () => {
		console.log('\x1b[36m%s\x1b[0m', `The HTTP server is running on port ${config.httpPort}`);
	});
	// Start the HTTPs server
	server.httpsServer.listen(config.httpsPort, () => {
		console.log('\x1b[35m%s\x1b[0m', `The HTTPS server is running on port ${config.httpsPort}`);
	});
};

// Export the module
module.exports = server;
