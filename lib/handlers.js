/* eslint-disable no-plusplus */
/*
* Request Handlers
*
*/

// Dependencies
const _performance = require('perf_hooks').performance;
const { PerformanceObserver } = require('perf_hooks');
const util = require('util');
const dns = require('dns');
const _url = require('url');
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

const debug = util.debuglog('performance');

// Define a handlers
const handlers = {};

/*
* HTML handlers
*
*/

handlers.index = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Uptime Monitoring - Made Simple',
			'head.description': 'We offer free services, simple uptime HTTP/HTTPS monitoring system',
			'body.title': '',
			'body.class': 'index',
		};
		// Read in a template as a string
		helpers.getTemplate('index', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Create Account
handlers.accountCreate = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Create an Account',
			'head.description': 'Signup is easy and only takes a few seconds.',
			'body.class': 'accountCreate',
		};
		// Read in a template as a string
		helpers.getTemplate('accountCreate', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

handlers.public = (data, callback) => {
	if (data.method === 'get') {
		const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
		if (trimmedAssetName.length > 0) {
			helpers.getStaticAsset(trimmedAssetName, (err, data) => {
				if (!err && data) {
					let contentType = 'plain';

					if (trimmedAssetName.indexOf('.css') > 1) {
						contentType = 'css';
					}

					if (trimmedAssetName.indexOf('.png') > -1) {
						contentType = 'png';
					}

					if (trimmedAssetName.indexOf('.jpg') > -1) {
						contentType = 'jpg';
					}

					if (trimmedAssetName.indexOf('.ico') > -1) {
						contentType = 'favicon';
					}

					// Callback the data
					callback(200, data, contentType);
				} else {
					callback(404);
				}
			});
		} else {
			callback(404);
		}
	} else {
		callback(405);
	}
};

// Create New Session
handlers.sessionCreate = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Login to your account.',
			'head.description': 'Please enter your phone number and password to access your account.',
			'body.class': 'sessionCreate',
		};
		// Read in a template as a string
		helpers.getTemplate('sessionCreate', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Session has been deleted
handlers.sessionDeleted = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Logged Out',
			'head.description': 'You have been logged out of your account.',
			'body.class': 'sessionDeleted',
		};
		// Read in a template as a string
		helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Edit Your Account
handlers.accountEdit = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Account Settings',
			'body.class': 'accountEdit',
		};
		// Read in a template as a string
		helpers.getTemplate('accountEdit', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Account has been deleted
handlers.accountDeleted = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Account Deleted',
			'head.description': 'Your account has been deleted.',
			'body.class': 'accountDeleted',
		};
		// Read in a template as a string
		helpers.getTemplate('accountDeleted', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Create a new check
handlers.checksCreate = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Create a New Check',
			'body.class': 'checksCreate',
		};
		// Read in a template as a string
		helpers.getTemplate('checksCreate', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Dashboard (view all checks)
handlers.checksList = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Dashboard',
			'body.class': 'checksList',
		};
		// Read in a template as a string
		helpers.getTemplate('checksList', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

// Edit a Check
handlers.checksEdit = (data, callback) => {
	// Reject any request that isn't a GET
	if (data.method === 'get') {
		// Prepare data for interpolation
		const templateData = {
			'head.title': 'Check Details',
			'body.class': 'checksEdit',
		};
		// Read in a template as a string
		helpers.getTemplate('checksEdit', templateData, (err, str) => {
			if (!err && str) {
				// Add the universal header and footer
				helpers.addUniversalTemplates(str, templateData, (err, str) => {
					if (!err && str) {
						// Return that page as HTML
						callback(200, str, 'html');
					} else {
						callback(500, undefined, 'html');
					}
				});
			} else {
				callback(500, undefined, 'html');
			}
		});
	} else {
		callback(405, undefined, 'html');
	}
};

/*
* API JSON handlers
*
*/

// Examples Error
handlers.exampleError = (data, callback) => {
	const err = new Error('This is examples of error');
	throw (err);
};

// Ping
handlers.ping = (data, callback) => {
	callback(200);
};

// Not-Found
handlers.notFound = (data, callback) => {
	callback(404);
};

// Users
handlers.users = (data, callback) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback);
	} else {
		callback(405);
	}
};

//  Container for the users submethods
handlers._users = {};

// Users - get
// Required data : phone
// Optional data : none
handlers._users.get = (data, callback) => {
	// Check that the phone number is valid
	const phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false;

	if (phone) {
		// Get token from the header
		const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

		// verify that token is valid for that phone number
		handlers._tokens.verifyToken(token, phone, (isValidToken) => {
			if (isValidToken) {
				_data.read('users', phone, (err, data) => {
					if (!err && data) {
						// get user
						delete data.hashedPassword;
						callback(200, data);
					} else {
						callback(404);
					}
				});
			} else {
				callback(403, { Error: 'Missing required token, or token is invalid' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Users - post
// required : firstName, lastName, phone, password, tosAgreement
// optional data : none
handlers._users.post = (data, callback) => {
	const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
	const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length >= 6 ? data.payload.password.trim() : false;
	const tosAgreement = typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? data.payload.tosAgreement : false;

	if (firstName && lastName && phone && password && tosAgreement) {
		// Make sure that the user doesnt already exist
		_data.read('users', phone, (err) => {
			if (err) {
				// Hash the password
				const hashedPassword = helpers.hash(password);

				if (hashedPassword) {
					// Create the user object
					const userObject = {
						firstName,
						lastName,
						phone,
						hashedPassword,
						tosAgreement: true,
					};

					// store the user
					_data.create('users', phone, userObject, (err) => {
						if (!err) {
							callback(200);
						} else {
							callback(500, { Error: 'Could not create the new user' });
						}
					});
				} else {
					callback(500, { Error: 'Cannot hashing password' });
				}
			} else {
				callback(404, { Error: 'A user with that phone number already exist' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required fields' });
	}
};

// Users - put
// Required field : phone
// optional data : firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, callback) => {
	// Check for required field
	const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;

	// check optional data
	const firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
	const lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
	const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length >= 6 ? data.payload.password.trim() : false;

	// check if phone exist
	if (phone) {
		if (firstName || lastName || password) {
			// Get token from the headers

			const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

			// verify that token is valid for that phone number
			handlers._tokens.verifyToken(token, phone, (isValidToken) => {
				if (isValidToken) {
					// lookup the user
					_data.read('users', phone, (err, data) => {
						if (!err && data) {
							if (firstName) {
								data.firstName = firstName;
							}
							if (lastName) {
								data.lastName = lastName;
							}
							if (password) {
								data.hashedPassword = helpers.hash(password);
							}

							// Store the new update
							_data.update('users', phone, data, (err) => {
								if (!err) {
									callback(200);
								} else {
									callback(500, { Error: 'Could not update the user' });
								}
							});
						} else {
							callback(404, { Error: 'The specified user is not exists' });
						}
					});
				} else {
					callback(403, { Error: 'Missing required token, or token is invalid' });
				}
			});
		} else {
			callback(400, { Error: 'Missing fields to update' });
		}
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};
// Users - delete
// Required data: phone
handlers._users.delete = (data, callback) => {
	// Check for required field
	const phone = typeof (data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length > 10 ? data.queryStringObject.phone.trim() : false;

	if (phone) {
		// Get token from the header
		const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

		// verify that token is valid for that phone number
		handlers._tokens.verifyToken(token, phone, (isValidToken) => {
			if (isValidToken) {
				_data.read('users', phone, (err, data) => {
					if (!err && data) {
						_data.delete('users', phone, (err) => {
							if (!err) {
								// Delete all depedency to users
								const userChecks = typeof (data.checks) === 'object' && data.checks instanceof Array ? data.checks : [];
								const checksToDelete = userChecks.length;

								if (checksToDelete > 0) {
									let checksDeleted = 0;
									let deletionsError = false;

									// Loop through the checks
									userChecks.forEach((checkId) => {
										_data.delete('checks', checkId, (err) => {
											if (err) {
												deletionsError = true;
											}
											checksDeleted++;
											if (checksToDelete === checksDeleted) {
												if (!deletionsError) {
													callback(200);
												} else {
													callback(500, { Error: 'Something error while deleting checks from users' });
												}
											}
										});
									});
								} else {
									callback(200);
								}
							} else {
								callback(500, { Error: 'Could not delete the user' });
							}
						});
					} else {
						callback(404, { Error: 'The specified user is not exists' });
					}
				});
			} else {
				callback(403, { Error: 'Missing required token, or token is invalid' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Tokens
handlers.tokens = (data, callback) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback);
	} else {
		callback(405);
	}
};

//  Container for the tokens submethods
handlers._tokens = {};

// Tokens - get
// Required fields: id
// Optional data: none
handlers._tokens.get = (data, callback) => {
	// Check that the id is valid
	const id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
	if (id) {
		_data.read('tokens', id, (err, data) => {
			if (!err && data) {
				// get user data
				callback(200, data);
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Tokens - post
// Required data : phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
	_performance.mark('entered function');
	const phone = typeof (data.payload.phone) === 'string' && data.payload.phone.trim().length > 10 ? data.payload.phone.trim() : false;
	const password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length >= 6 ? data.payload.password.trim() : false;
	_performance.mark('inputs validated');
	if (phone && password) {
		_performance.mark('beginning user lookup');
		// Lookup the user who matches that phone number
		_data.read('users', phone, (err, data) => {
			_performance.mark('user lookup complete');
			if (!err && data) {
				_performance.mark('beginning password hashing');
				// Hash the sent password, and compare to the hashed password stored in users object
				const hashedPassword = helpers.hash(password);
				_performance.mark('password hashing complete');
				if (hashedPassword === data.hashedPassword) {
					_performance.mark('creating data for token');
					// if valid, create a new token with a random name. Set expiration date 1 hour in the future
					const tokenId = helpers.createRandomString(20);
					const expires = Date.now() + 1000 * 60 * 60;
					const tokenObject = {
						phone,
						id: tokenId,
						expires,
					};

					// store the token
					_performance.mark('beginning storing token');
					_data.create('tokens', tokenId, tokenObject, (err) => {
						_performance.mark('storing token complete');
						// Log out all the measurements
						const measurements = [];
						const obs = new PerformanceObserver((list) => {
							measurements.push(...list.getEntries());
						});
						obs.disconnect();
						obs.observe({ entryTypes: ['measure'] });
						// Gather all measurements
						_performance.measure('Beginning to end', 'entered function', 'storing token complete');
						_performance.measure('Validating user inputs', 'entered function', 'inputs validated');
						_performance.measure('User lookup', 'beginning user lookup', 'user lookup complete');
						_performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
						_performance.measure('Token data creation', 'creating data for token', 'beginning storing token');
						_performance.measure('Token storing', 'beginning storing token', 'storing token complete');

						measurements.forEach((measurement) => {
							debug('\x1b[33m%s\x1b[0m', `${measurement.name} ${measurement.duration}`);
						});
						if (!err) {
							callback(200, tokenObject);
						} else {
							callback(500, { Error: 'Could not create the new token' });
						}
					});
				} else {
					callback(400, { Error: 'Password did not match' });
				}
			} else {
				callback(400, { Error: 'Could not find the specified user' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field(s)' });
	}
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
	const id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
	const extend = !!(typeof (data.payload.extend) === 'boolean' && data.payload.extend === true);

	if (id && extend) {
		_data.read('tokens', id, (err, data) => {
			if (!err && data) {
				if (data.expires > Date.now()) {
					data.expires = Date.now() + 1000 * 60 * 60;

					// update data
					_data.update('tokens', id, data, (err) => {
						if (!err) {
							callback(200);
						} else {
							callback(500, { Error: 'Could not update token\'s expiration' });
						}
					});
				}
			} else {
				callback(400, { Error: 'Specified token does not exist' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field(s)' });
	}
};

// Tokens - delete
// Required field: id
// optional field: none
handlers._tokens.delete = (data, callback) => {
	// Check for required field
	const id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

	if (id) {
		_data.read('tokens', id, (err, data) => {
			if (!err && data) {
				_data.delete('tokens', id, (err) => {
					if (!err) {
						callback(200);
					} else {
						callback(500, { Error: 'Could not delete the token' });
					}
				});
			} else {
				callback(404, { Error: 'The specified token is not exists' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
	// Lookup the token
	_data.read('tokens', id, (err, data) => {
		if (!err && data) {
			if (data.phone === phone && data.expires > Date.now()) {
				callback(true);
			} else {
				callback(false);
			}
		} else {
			callback(false);
		}
	});
};

// Checks
handlers.checks = (data, callback) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._checks[data.method](data, callback);
	} else {
		callback(405);
	}
};

//  Container for the Checks submethods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCode, timeoutSeconds
// Optional data: none
handlers._checks.post = (data, callback) => {
	// Validate input
	const protocol = typeof (data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	const url = typeof (data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	const method = typeof (data.payload.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	const successCodes = typeof (data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	const timeoutSeconds = typeof (data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

	if (protocol && url && method && successCodes && timeoutSeconds) {
		const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

		_data.read('tokens', token, (err, data) => {
			if (!err && data) {
				const { phone } = data;

				_data.read('users', phone, (err, data) => {
					if (!err && data) {
						const userChecks = typeof (data.checks) === 'object' && data.checks instanceof Array ? data.checks : [];

						if (userChecks.length < config.maxChecks) {
							// Verify that the URL given has DNS entries (and therefore can resolve)
							const parsedUrl = _url.parse(`${protocol}://${url}`, true);
							const hostName = typeof (parsedUrl.hostname) === 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;

							dns.resolve(hostName, (err, records) => {
								if (!err && records) {
									// Create a random id for checks
									const checkId = helpers.createRandomString(20);

									// create check object
									const checkObject = {
										id: checkId,
										userPhone: phone,
										protocol,
										url,
										method,
										successCodes,
										timeoutSeconds,
									};

									// save the object
									_data.create('checks', checkId, checkObject, (err) => {
										if (!err) {
											data.checks = userChecks;
											data.checks.push(checkId);

											// Save the new user data
											_data.update('users', phone, data, (err) => {
												if (!err) {
													callback(200, checkObject);
												} else {
													callback(500, { Error: 'Could not update the user with the new checks' });
												}
											});
										} else {
											callback(500, { Error: 'Could not create the new checks' });
										}
									});
								} else {
									callback(400, { Error: 'The hostname of the URL entered did not resolve tp any DNS entries' });
								}
							});
						} else {
							callback(400, { Error: `The user already has the maximum number of checks ${config.maxChecks}` });
						}
					} else {
						callback(403);
					}
				});
			} else {
				callback(403);
			}
		});
	} else {
		callback(400, { Error: 'Missing required input field(s)' });
	}
};

// Checks - get
// Required data: id
// Optional data: none
handlers._checks.get = (data, callback) => {
	const id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

	if (id) {
		// Lookup the checks
		_data.read('checks', id, (err, checkData) => {
			if (!err && checkData) {
				// Get token from the header
				const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

				// verify that token is valid for that phone number
				handlers._tokens.verifyToken(token, checkData.userPhone, (isValidToken) => {
					if (isValidToken) {
						// Return the check data
						callback(200, checkData);
					} else {
						callback(403, { Error: 'Missing required token, or token is invalid' });
					}
				});
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Checks - put
// Required data: id
// Optional data: protocol, url, method, successCode, timeoutSeconds
handlers._checks.put = (data, callback) => {
	// Check for required field
	const id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;

	const protocol = typeof (data.payload.protocol) === 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
	const url = typeof (data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
	const method = typeof (data.payload.method) === 'string' && ['get', 'post', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
	const successCodes = typeof (data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
	const timeoutSeconds = typeof (data.payload.timeoutSeconds) === 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;

	if (id) {
		if (protocol || url || method || successCodes || timeoutSeconds) {
			_data.read('checks', id, (err, checkData) => {
				if (!err && checkData) {
					// Get token from the header
					const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

					// verify that token is valid for that phone number
					handlers._tokens.verifyToken(token, checkData.userPhone, (isValidToken) => {
						if (isValidToken) {
							if (protocol) {
								checkData.protocol = protocol;
							}
							if (url) {
								checkData.url = url;
							}
							if (method) {
								checkData.method = method;
							}
							if (successCodes) {
								checkData.successCodes = successCodes;
							}
							if (timeoutSeconds) {
								checkData.timeoutSeconds = timeoutSeconds;
							}

							_data.update('checks', id, checkData, (err) => {
								if (!err) {
									callback(200);
								} else {
									callback(500, { Error: 'Could not update the checks' });
								}
							});
						} else {
							callback(403, { Error: 'Missing required token, or token is invalid' });
						}
					});
				} else {
					callback(400, { Error: 'check id is not match' });
				}
			});
		}
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

// Checks - delete
// Required data: id
// Optional data: none

handlers._checks.delete = (data, callback) => {
	// Check for required field
	const id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;

	if (id) {
		// Lookup checks data
		_data.read('checks', id, (err, checkData) => {
			if (!err && checkData) {
				// Get token from the header
				const token = typeof (data.headers.token) === 'string' && data.headers.token.trim().length === 20 ? data.headers.token.trim() : false;

				// verify that token is valid for that phone number
				handlers._tokens.verifyToken(token, checkData.userPhone, (isValidToken) => {
					if (isValidToken) {
						_data.delete('checks', id, (err) => {
							if (!err) {
								_data.read('users', checkData.userPhone, (err, data) => {
									if (!err && data) {
										const userChecks = typeof (data.checks) === 'object' && data.checks instanceof Array ? data.checks : [];
										const checkPosition = userChecks.indexOf(id);
										if (checkPosition > -1) {
											userChecks.splice(checkPosition, 1);
											// Resave the user data
											_data.update('users', checkData.userPhone, data, (err) => {
												if (!err) {
													callback(200);
												} else {
													callback(500, { Error: 'Could not update the user' });
												}
											});
										} else {
											callback(500, { Error: 'Could not find the check' });
										}
									} else {
										callback(404, { Error: 'The specified user is not exists' });
									}
								});
							} else {
								callback(500, { Error: 'Could not delete the check data' });
							}
						});
					} else {
						callback(403, { Error: 'Missing required token, or token is invalid' });
					}
				});
			} else {
				callback(404, { Error: 'The specified checks is not exists' });
			}
		});
	} else {
		callback(400, { Error: 'Missing required field' });
	}
};

handlers.ping = (data, callback) => {
	// Callback a http status code, and a payload object
	callback(200);
};

// not found handlers
handlers.notFound = (data, callback) => {
	callback(404);
};

module.exports = handlers;
