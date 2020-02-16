/*
* Example VM
* Running some arbitrary commands
*/

const vm = require('vm');

// Define a context for the script to run in
const context = {
	foo: 25,
	bar: 0,
	fizz: 0,
};

// Define the script
const script = new vm.Script(`
    foo = foo * 2;
    bar = foo + 1;
    fizz = 52;
`);

// Run the script
script.runInNewContext(context);
console.log(context);
