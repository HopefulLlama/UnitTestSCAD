var os = require('os');
var winston = require('winston');

var USAGE = 'usage: unittestscad <file>';

function ErrorHandler() {}

ErrorHandler.prototype.REASONS = {
  ASSERTION_FAILURES: 'Exiting with error, due to failing test assertions.',
  FILE_EXECUTION_ERROR: 'Exiting with error, due to execution error in a file.',
  INVALID_CONFIG: USAGE + os.EOL + 'The supplied path to the configuration file does not point to a valid configuration file.',
  MISSING_CONFIG: USAGE + os.EOL + 'Must specify a configuration file when calling UnitTestSCAD.'
};

ErrorHandler.prototype.throwErrorAndSetExitCode = function(reason) {
  winston.error(reason);
  process.exitCode = 1;
};

module.exports = new ErrorHandler();