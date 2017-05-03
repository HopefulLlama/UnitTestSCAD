var os = require('os');

var USAGE = "usage: unittestscad <file>";

function ErrorHandler() {}

ErrorHandler.prototype.REASONS = {
	INVALID_CONFIG: USAGE + os.EOL + "The supplied path to the configuration file does not point to a valid configuration file.",
	ASSERTION_FAILURES: "Exiting with error, due to failing test assertions."
};

ErrorHandler.prototype.throwErrorAndExit = function(reason) {
	console.log(reason);
	process.exit(1);
};

module.exports = new ErrorHandler();