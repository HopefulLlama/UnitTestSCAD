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

TestCase.prototype.assert = function(prefix, failures, actual) {
  var _this = this;

  this.expectedOutput.forEach(function(expected) {
    expected = expected.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    if(actual.output.match(expected) === null) {
      failures.push(_this.name + ': ' + prefix + ': Expected ' + actual.output + ' to contain ' + expected);
    }
  });
  if(actual.exitCode !== this.expectedExitCode) {
    failures.push(this.name + ': ' + prefix + ': Expected ' + actual.exitCode + ' to be ' + this.expectedExitCode);
  }

  this.callbacks.forEach(function(callback) {
    callback(_this, prefix, failures);
  });

  this.reset();
};

TestCase.prototype.executeCli = function() {
  var actual = {
    output: undefined,
    exitCode: undefined
  };

  try {
    actual.output = E2eUtils.executeCli(this.config).toString();
    actual.exitCode = 0;
  } catch(a) {
    actual.output = a.stdout.toString();
    actual.exitCode = a.status;
  } finally {
    this.assert('cli', this.cliFailures, actual);
  }
};

TestCase.prototype.executeRequire = function() {
  var template = 'spec/e2e/RequireTemplate.js';
  
  var contents = fs.readFileSync(template, 'utf8');
  var replacement = (this.config !== undefined) ? "'" + this.config + "'" : '';
  contents = contents.replace('<config>', replacement);

  fs.writeFileSync(E2eValues.TEMP_REQUIRE, contents);

  var actual = {
    output: undefined,
    exitCode: undefined
  };

  try {
    actual.output = E2eUtils.executeRequire(this.config).toString();
    actual.exitCode = 0;
  } catch(a) {
    actual.output = a.stdout.toString();
    actual.exitCode = a.status;
  } finally {
    this.assert('require', this.requireFailures, actual);
  }
};

module.exports = TestCase;