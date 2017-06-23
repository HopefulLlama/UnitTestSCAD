var os = require('os');

var E2eUtils = require('../util/E2eUtils');

function E2eRunner(tests) {
  this.tests = (tests !== undefined) ? tests : [];
}

E2eRunner.prototype.execute = function() {
  this.tests.forEach(function(test) {
    test.execute();
    if(test.failures.length === 0) {
    	process.stdout.write('.');
    } else {
    	process.stdout.write('F');
    }
  });
  console.log(os.EOL + this.aggregateFailures().length + ' failures in ' + this.tests.length + ' tests.');
};

E2eRunner.prototype.aggregateFailures = function() {
  return this.tests.reduce(function(previousValue, currentValue) {
    return previousValue.concat(currentValue.failures);
  }, []);
};

module.exports = E2eRunner;