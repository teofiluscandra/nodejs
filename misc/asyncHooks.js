/*
 * Async Hooks Example
 *
 *
 */

// Dependencies
const asyncHooks = require('async_hooks');
const fs = require('fs');

// Target execution context
const targetExecutionContext = false;

// Write an arbitrary async function
const whatTimeIsIt = function (callback) {
	setInterval(() => {
		fs.writeSync(1, `When the setInterval runs, the execution context is ${asyncHooks.executionAsyncId()}\n`);
		callback(Date.now());
	}, 1000);
};

// Call that function
whatTimeIsIt((time) => {
	fs.writeSync(1, `The time is ${time}\n`);
});

// Hooks
const hooks = {
	init(asyncId, type, triggerAsyncId, resource) {
		fs.writeSync(1, `Hook init ${asyncId}\n`);
	},
	before(asyncId) {
		fs.writeSync(1, `Hook before ${asyncId}\n`);
	},
	after(asyncId) {
		fs.writeSync(1, `Hook after ${asyncId}\n`);
	},
	destroy(asyncId) {
		fs.writeSync(1, `Hook destroy ${asyncId}\n`);
	},
	promiseResolve(asyncId) {
		fs.writeSync(1, `Hook promiseResolve. ${asyncId} This isnt applicable to our context, and should never get called here\n`);
	},
};

// Create a new AsyncHook instance. All of these callbacks are optional.
const asyncHook = asyncHooks.createHook(hooks);
asyncHook.enable();
