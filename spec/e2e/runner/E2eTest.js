var E2eValues = require('../util/E2eValues');
var E2eUtils = require('../util/E2eUtils');

function TestCase(name, config, expectedOutput, expectedExitCode, callbacks) {
  this.name = name;
  this.config = (config !== undefined) ? E2eValues.CONFIG_BASE + config : undefined;
  this.expectedOutput = expectedOutput;
  this.expectedExitCode = (expectedExitCode !== undefined) ? expectedExitCode : 0;

  this.actualOutput = undefined;
  this.actualExitCode = undefined;

  this.failures = [];

  this.callbacks = (callbacks !== undefined) ? callbacks : [];
}

TestCase.prototype.execute = function() {
  try {
    this.actualOutput = E2eUtils.execute(this.config).toString();
    this.actualExitCode = 0;
  } catch(a) {
    this.actualOutput = a.stdout.toString();
    this.actualExitCode = a.status;
  } finally {
    var _this = this;

    this.expectedOutput.forEach(function(expected) {
    	expected = expected.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      if(_this.actualOutput.match(expected) === null) {
        _this.failures.push(_this.name + ': Expected ' + _this.actualOutput + ' to contain ' + expected);
      }
    });
    if(this.actualExitCode !== this.expectedExitCode) {
      this.failures.push(this.name + ': Expected ' + this.actualExitCode + ' to be ' + this.expectedExitCode);
    }

    this.callbacks.forEach(function(callback) {
    	callback(_this);
    });
  }
};

module.exports = TestCase;