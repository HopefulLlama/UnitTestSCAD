var fs = require('fs');
var os = require('os');

var E2eTest = require('./runner/E2eTest');
var E2eRunner = require('./runner/E2eRunner');

var TERMINAL = require('../../src/constants/Terminal');

var USAGE = 'usage: unittestscad <file>';

function runE2e() {
  var runner = new E2eRunner([
    new E2eTest('should ask for config file', undefined, [
      USAGE, 
      'Must specify a configuration file when calling UnitTestSCAD.'
    ], 1),
    new E2eTest('should say it does not exist', 'fake.json', [
      USAGE,
      'The supplied path to the configuration file does not point to a valid configuration file.'
    ], 1),
    new E2eTest('should say it is invalid', 'cli/invalid.json', [
      USAGE, 
      'The supplied path to the configuration file does not point to a valid configuration file.'
    ], 1),
    new E2eTest('should say there is an error in the spec file', 'cli/errorInSpec.json', [
      'ERROR: Unexpected exception occurred in file: errorInSpec.js',
      'SyntaxError: Unexpected token {',
      'Exiting with error, due to execution error in a file.'
    ], 1),
    new E2eTest('should say there is an error in the custom reporter file', 'cli/errorInReporter.json', [
      'ERROR: Unexpected exception occurred in file: faultyReporter.js',
      'SyntaxError: Unexpected token {',
      'Exiting with error, due to execution error in a file.'
    ], 1),
    new E2eTest('should say there is an exception in the OpenScad module', 'file-execution/config.json', [
      'ERROR: Found an error compiling OpenSCAD command given.',
      'See below for output.',
      'Begin OpenSCAD output',
      'WARNING: Ignoring unknown module \'covfefe\'.',
      'Current top level object is empty',
      'End OpenSCAD output',
      'ERROR: Unexpected exception occurred in file: spec.js',
      'Exiting with error, due to execution error in a file.'
    ], 1),
    new E2eTest('should report failures', 'fail/config.json', [
      'fail:',
      'should fail:',
      'Expected <8> to be <0>.',
      TERMINAL.RED + '1 failures' + TERMINAL.RESET + ' in 1 assertions',
      TERMINAL.RED + '1 total failures' + TERMINAL.RESET + ' in 1 total assertions',
      'Exiting with error, due to failing test assertions.'
    ], 1),
    new E2eTest('should pass', 'pass/config.json', [
      'pass:',
      'should pass:',
      TERMINAL.GREEN + '0 failures' + TERMINAL.RESET + ' in 17 assertions.',
      'openScad2DModule:',
      TERMINAL.GREEN + '0 failures' + TERMINAL.RESET + ' in 13 assertions.',
      'openScadFunction:',
      TERMINAL.GREEN + '0 failures' + TERMINAL.RESET + ' in 32 assertions.',
      TERMINAL.GREEN + '0 total failures' + TERMINAL.RESET + ' in 62 total assertions.'
    ]),
    new E2eTest('should use and include correctly', 'use-include/config.json', [
      TERMINAL.GREEN + '0 total failures' + TERMINAL.RESET + ' in 3 total assertions.'
    ]),
    new E2eTest('should report', 'reporters/config.json', [
      'Results written to JsonOutput.json',
      'Results written to XmlOutput.xml',
      'Hello, custom reporter working.'
    ], 0, [function(test, prefix, failures) {
      var base = './spec/e2e/resources/reporters/';
      var utf8 = 'utf8';

      var assertions = [{
        file: 'JsonOutput.json',
        expected: 'Expected.json'
      }, {
        file: 'XmlOutput.xml',
        expected: 'Expected.xml'
      }].forEach(function(assertion) {
        if(fs.existsSync(base + assertion.file)) {
          var actual = fs.readFileSync(base + assertion.file, utf8).replace(/\n/g, '\r\n'); // Normalize line endings to match
          var expected = fs.readFileSync(base + assertion.expected, utf8);

          if(actual !== expected) {
            failures.push(test.name + ': ' + prefix + ': Expected ' + assertion.file + ' to match ' + assertion.expected);
          }

          fs.unlinkSync(base + assertion.file);
        } else {
          failures.push(test.name + ': ' + prefix + ':  Expected ' + assertion.file + ' to be written');
        }
      });
    }])
  ]);

  runner.execute();

  return runner.aggregateFailures();
}

module.exports = runE2e;