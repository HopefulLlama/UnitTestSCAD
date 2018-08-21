const os = require('os');
const winston = require('winston');

const USAGE = 'usage: unittestscad <file>';

module.exports = {
  REASONS: {
    ASSERTION_FAILURES: 'Exiting with error, due to failing test assertions.',
    FILE_EXECUTION_ERROR: 'Exiting with error, due to execution error in a file.',
    INVALID_CONFIG: `${USAGE}${os.EOL}The supplied path to the configuration file does not point to a valid configuration file.`,
    MISSING_CONFIG: `${USAGE}${os.EOL}Must specify a configuration file when calling UnitTestSCAD.`
  },
  throwErrorAndSetExitCode(reason) {
    winston.error(reason);
    process.exitCode = 1;
  }
};