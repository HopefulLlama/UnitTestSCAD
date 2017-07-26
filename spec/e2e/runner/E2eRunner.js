var fs = require('fs');
var os = require('os');
var winston = require('winston');

var E2eUtils = require('../util/E2eUtils');
var E2eValues = require('../util/E2eValues');

function E2eRunner(tests) {
  this.tests = (tests !== undefined) ? tests : [];
}

function outputResult(failures) {
  if(failures === 0) {
    process.stdout.write('.');
  } else {
    process.stdout.write('F');
  } 
}

E2eRunner.prototype.execute = function() {
  this.tests.forEach(function(test) {
    test.executeCli();
    outputResult(test.cliFailures.length);
    test.executeRequire();
    outputResult(test.requireFailures.length);
  });
  
  if(fs.existsSync(E2eValues.TEMP_REQUIRE)) {
    fs.unlinkSync(E2eValues.TEMP_REQUIRE);
  }
  winston.info(os.EOL + this.aggregateFailures().length + ' failures in ' + this.tests.length * 2 + ' tests.');
};

E2eRunner.prototype.aggregateFailures = function() {
  return this.tests.reduce(function(previousValue, currentValue) {
    previousValue = previousValue.concat(currentValue.cliFailures);
    previousValue = previousValue.concat(currentValue.requireFailures);
    return previousValue;
  }, []);
};

module.exports = E2eRunner;