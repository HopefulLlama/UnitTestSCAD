var os = require('os');

var USAGE = "usage: unittestscad <file>";

function ErrorHandler() {}

ErrorHandler.prototype.REASONS = {
  INVALID_CONFIG: USAGE + os.EOL + "The supplied path to the configuration file does not point to a valid configuration file.",
  MISSING_CONFIG: USAGE + os.EOL + "Must specify a configuration file when calling UnitTestSCAD.",
  ASSERTION_FAILURES: "Exiting with error, due to failing test assertions."
};

ErrorHandler.prototype.throwErrorAndSetExitCode = function(reason) {
  console.log(reason);
  process.exitCode = 1;
};

module.exports = new ErrorHandler();