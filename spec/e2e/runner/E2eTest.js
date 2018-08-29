const fs = require('fs');

const E2eValues = require('../util/E2eValues');
const E2eUtils = require('../util/E2eUtils');

module.exports = class {
  constructor(name, config, expectedOutput, expectedExitCode, callbacks) {
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

  reset() {
    this.actualOutput = undefined;
    this.actualExitCode = undefined;
  }

  assert(prefix, failures, actual) {
    this.expectedOutput.forEach(expected => {
      expected = expected.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      if(actual.output.match(expected) === null) {
        failures.push(`${this.name}': ${prefix}: Expected ${actual.output} to contain ${expected}`);
      }
    });
    if(actual.exitCode !== this.expectedExitCode) {
      failures.push(`${this.name}: ${prefix}: Expected ${actual.exitCode} to be ${this.expectedExitCode}`);
    }

    this.callbacks.forEach(callback => callback(this, prefix, failures));

    this.reset();
  }

  executeCli() {
    const actual = {
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
  }

  executeRequire() {
    const template = 'spec/e2e/RequireTemplate.js';

    let contents = fs.readFileSync(template, 'utf8');
    const replacement = (this.config !== undefined) ? `'${this.config}'`: '';
    contents = contents.replace('<config>', replacement);

    fs.writeFileSync(E2eValues.TEMP_REQUIRE, contents);

    const actual = {
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
  }
};