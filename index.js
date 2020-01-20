/*
*	Primary file of the API
*/

// Depedencies
const server = require('./lib/server');
const workers = require('./lib/workers');

const app = {};

app.init = () => {
	server.init();
	workers.init();
};

// Execute
app.init();

module.exports = app;
