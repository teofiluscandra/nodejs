/* eslint-disable no-console */
/**
 * Test Runner
 */

// Overide the NODE_ENV variable
process.env.NODE_ENV = 'testing';

// App logic for test runner
const _app = {};

// Container for the test
_app.tests = {};

// Add on the unit test
_app.tests.unit = require('./unit');

// Add on API test
_app.tests.api = require('./api');

// Count all the tests
_app.countTests = () => {
	let counter = 0;

	Object.keys(_app.tests).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(_app.tests, key)) {
			const subTests = _app.tests[key];
			Object.keys(subTests).forEach((testName) => {
				if (Object.prototype.hasOwnProperty.call(subTests, testName)) {
					counter += 1;
				}
			});
		}
	});
	return counter;
};

// Product a test outcome report
_app.produceTestReport = (limit, successes, errors) => {
	console.log('');
	console.log('--------BEGIN TEST REPORT--------');
	console.log('');
	console.log('Total Tests: ', limit);
	console.log('Pass: ', successes);
	console.log('Fail: ', errors.length);
	console.log('');

	// If there are errors, print them in detail
	if (errors.length > 0) {
		console.log('--------BEGIN ERROR DETAILS--------');
		console.log('');
		errors.forEach((testError) => {
			console.log('\x1b[31m%s\x1b[0m', testError.name);
			console.log(testError.error);
			console.log('');
		});
		console.log('');
		console.log('--------END ERROR DETAILS--------');
	}


	console.log('');
	console.log('--------END TEST REPORT--------');
	process.exit(0);
};

// Run all the test
_app.runTests = () => {
	const errors = [];
	let successes = 0;
	const limit = _app.countTests();
	let counter = 0;
	const testsKeys = Object.keys(_app.tests);
	testsKeys.forEach((test) => {
		if (Object.prototype.hasOwnProperty.call(_app.tests, test)) {
			Object.keys(_app.tests[test]).forEach((key) => {
				if (Object.prototype.hasOwnProperty.call(_app.tests[test], key)) {
					(() => {
						// const tmpTestName = key;
						const testValue = _app.tests[test][key];
						try {
							testValue(() => {
								// console.log('\x1b[32m%s\x1b[0m', tmpTestName);
								counter += 1;
								successes += 1;
								if (counter === limit) {
									_app.produceTestReport(limit, successes, errors);
								}
							});
						} catch (e) {
							// if its throws, then it failed
							errors.push({
								name: _app.tests[test][key],
								error: e,
							});
							// console.log('\x1b[31m%s\x1b[0m', tmpTestName);
							counter += 1;
							if (counter === limit) {
								_app.produceTestReport(limit, successes, errors);
							}
						}
					})();
				}
			});
		}
	});
};

// Run the tests
_app.runTests();
