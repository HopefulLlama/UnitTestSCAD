var fs = require('fs');

var E2eValues = require('../util/E2eValues');
var E2eUtils = require('../util/E2eUtils');

function TestCase(name, config, expectedOutput, expectedExitCode, callbacks) {
  this.name = name;
  this.config = (config !== undefined) ? E2eValues.CONFIG_BASE + config : undefined;
  this.expectedOutput = expectedOutput;
  this.expectedExitCode = (expectedExitCode !== undefined) ? expectedExitCode : 0;

  this.actualOutput = undefined;
  this.actualExitCode = undefined;

  this.cliFailures = [];
  this.requireFailures = [];

  this.callbacks = (callbacks !== undefined) ? callbacks : [];
}

TestCase.prototype.reset = function() {
  this.actualOutput = undefined;
  this.actualExitCode = undefined;
};

TestCase.prototype.assert = function(prefix, failures) {
  var _this = this;

  this.expectedOutput.forEach(function(expected) {
    expected = expected.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    if(_this.actualOutput.match(expected) === null) {
      failures.push(_this.name + ': ' + prefix + ': Expected ' + _this.actualOutput + ' to contain ' + expected);
    }
  });
  if(this.actualExitCode !== this.expectedExitCode) {
    failures.push(this.name + ': ' + prefix + ': Expected ' + this.actualExitCode + ' to be ' + this.expectedExitCode);
  }

  this.callbacks.forEach(function(callback) {
    callback(_this, prefix, failures);
  });

  this.reset();
};

TestCase.prototype.executeCli = function() {
  try {
    this.actualOutput = E2eUtils.executeCli(this.config).toString();
    this.actualExitCode = 0;
  } catch(a) {
    this.actualOutput = a.stdout.toString();
    this.actualExitCode = a.status;
  } finally {
    this.assert('cli', this.cliFailures);
  }
};

TestCase.prototype.executeRequire = function() {
  var template = 'spec/e2e/RequireTemplate.js';
  
  var contents = fs.readFileSync(template, 'utf8');
  contents = contents.replace('<config>', this.config);

  fs.writeFileSync(E2eValues.TEMP_REQUIRE, contents);
  try {
    this.actualOutput = E2eUtils.executeCli(this.config).toString();
    this.actualExitCode = 0;
  } catch(a) {
    this.actualOutput = a.stdout.toString();
    this.actualExitCode = a.status;
  } finally {
    this.assert('require', this.requireFailures);
  }
};

module.exports = TestCase;