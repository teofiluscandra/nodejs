/*
*	Primary file of the API
*/

// Depedencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

const app = {};

// Declare global
foo = 'bar';

app.init = () => {
	server.init();
	workers.init();

	// start cli, last
	setTimeout(() => {
		cli.init();
	}, 50);
};

// Execute
app.init();

module.exports = app;
