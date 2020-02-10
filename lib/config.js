// Create and export configuration variables

// Container for all the environments
const environments = {};

// Staging (Default) Environment
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging',
	hashingSecret: 'thisissecret',
	maxChecks: 5,
	templateGlobals: {
		appName: 'UptimeChecker',
		companyName: 'NotARealCompany, Inc.',
		yearCreated: '2018',
		baseUrl: 'http://localhost:3000/',
	},
};

// Testing environment
environments.testing = {
	httpPort: 4000,
	httpsPort: 4001,
	envName: 'testing',
	hashingSecret: 'thisIsASecret',
	maxChecks: 5,
	twilio: {
		accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
		authToken: '9455e3eb3109edc12e3d8c92768f7a67',
		fromPhone: '+15005550006',
	},
	templateGlobals: {
		appName: 'UptimeChecker',
		companyName: 'NotARealCompany, Inc.',
		yearCreated: '2018',
		baseUrl: 'http://localhost:4000/',
	},
};

// Production Environment
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'Production',
	hashingSecret: 'thisissecret',
	maxChecks: 5,
	templateGlobals: {
		appName: 'UptimeChecker',
		companyName: 'NotARealCompany, Inc.',
		yearCreated: '2018',
	},
};

// Determine which env was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is one of the environtment above, if not, default to staging
const environmentToExport = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
