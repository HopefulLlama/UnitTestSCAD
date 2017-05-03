var os = require('os');

function ErrorHandler() {}

ErrorHandler.prototype.USAGE = "unittestscad <file>";

ErrorHandler.prototype.REASONS = {
	CONFIG_DOES_NOT_EXIST: ErrorHandler.USAGE + os.EOL + "The supplied path to the configuration file does not point to a valid configuration file.",
	ASSERTION_FAILURES: "Exiting with error, due to failing test assertions."
};

ErrorHandler.prototype.throwErrorAndExit = function(reason) {
	console.log(reason);
	process.exit(1);
};

module.exports = new ErrorHandler();