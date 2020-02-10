/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/*
*	Primary file of the API
*	**nodejs bug while debugging
*/

// Depedencies
const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');

const app = {};

app.init = () => {
	// Start the server
	debugger;
	server.init();
	debugger;

	// Start the workers
	debugger;
	workers.init();
	debugger;

	// Start the CLI, but make sure it starts last
	debugger;
	setTimeout(() => {
		cli.init();
		debugger;
	}, 50);
	debugger;

	// Start an example script that has issues (throws an error)
	debugger;
	// Set foo at 1
	let foo = 1;
	console.log('Just assigned 1 to foo');
	debugger;

	// Increment foo
	foo += 1;
	console.log('Just incremented foo');
	debugger;

	// Square foo
	foo *= foo;
	console.log('Just multipled foo by itself');
	debugger;

	// Convert foo to a string
	foo = foo.toString();
	console.log('Just changed foo to a string');
	debugger;

	// Call the init script that will throw
	exampleDebuggingProblem.init();
	debugger;
};

// Execute
app.init();

module.exports = app;
