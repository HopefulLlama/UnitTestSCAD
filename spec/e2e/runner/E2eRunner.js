const fs = require('fs');
const os = require('os');
const winston = require('winston');

const E2eValues = require('../util/E2eValues');

function outputResult(failures) {
  if(failures === 0) {
    process.stdout.write('.');
  } else {
    process.stdout.write('F');
  }
}

module.exports = class {
  constructor(tests) {
    this.tests = tests !== undefined ? tests : [];
  }

  execute() {
    this.tests.forEach(test => {
      test.executeCli();
      outputResult(test.cliFailures.length);
      test.executeRequire();
      outputResult(test.requireFailures.length);
    });

    if(fs.existsSync(E2eValues.TEMP_REQUIRE)) {
      fs.unlinkSync(E2eValues.TEMP_REQUIRE);
    }
    winston.info(`${os.EOL}${this.aggregateFailures().length} failures in ${this.tests.length * 2} tests.`);
  }

  aggregateFailures() {
    return this.tests.reduce((previousValue, currentValue) => {
      previousValue = previousValue.concat(currentValue.cliFailures);
      previousValue = previousValue.concat(currentValue.requireFailures);
      return previousValue;
    }, []);
  }
};