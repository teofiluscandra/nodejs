/**
 * Library for storing and editing data
 */

// Depedencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = (dir, file, data, callback) => {
	// open file to writing
	fs.open(`${lib.baseDir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			// convert data to string
			const stringData = JSON.stringify(data);

			fs.writeFile(fileDescriptor, stringData, (err) => {
				if (!err) {
					fs.close(fileDescriptor, (err) => {
						if (!err) {
							callback(false);
						} else {
							callback('error closing new file');
						}
					});
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Could not create a new file, it may already exists');
		}
	});
};

lib.read = (dir, file, callback) => {
	fs.readFile(`${lib.baseDir + dir}/${file}.json`, 'utf8', (err, data) => {
		if (!err && data) {
			const parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	});
};

lib.update = (dir, file, data, callback) => {
	// open file to writing
	fs.open(`${lib.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			// convert data to string
			const stringData = JSON.stringify(data);

			fs.ftruncate(fileDescriptor, (err) => {
				if (!err) {
					fs.writeFile(fileDescriptor, stringData, (err) => {
						if (!err) {
							fs.close(fileDescriptor, (err) => {
								if (!err) {
									callback(false);
								} else {
									callback('error closing new file');
								}
							});
						} else {
							callback('Error writing to new file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Could not create a new file, it may already exists');
		}
	});
};

lib.delete = (dir, file, callback) => {
	fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting the file');
		}
	});
};

// List all the items in a directory
lib.list = (dir, callback) => {
	fs.readdir(`${lib.baseDir + dir}/`, (err, data) => {
		if (!err && data && data.length > 0) {
			const trimmedFileNames = [];
			data.forEach((fileName) => {
				trimmedFileNames.push(fileName.replace('.json', ''));
			});
			callback(false, trimmedFileNames);
		} else {
			callback(err, data);
		}
	});
};

module.exports = lib;
