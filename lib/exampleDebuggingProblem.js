/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/**
 * Library that throw err when init called
 */

const example = {};

example.init = () => {
	const foo = bar;
};

module.exports = example;
