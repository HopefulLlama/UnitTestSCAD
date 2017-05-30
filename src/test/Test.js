var os = require('os');

function Test(name, testSuite) {
  this.name = name;
  this.assertions = 0;
  this.failures = [];

  this.testSuite = testSuite;
}

Test.prototype.getSummary = function() {
  return {
    'name': this.name,
    'assertions': this.assertions,
    'failures' : this.failures
  };
};

module.exports = Test;