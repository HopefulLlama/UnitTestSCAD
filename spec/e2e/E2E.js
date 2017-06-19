var fs = require('fs');
var os = require('os');

var E2eTest = require('./runner/E2eTest');
var E2eRunner = require('./runner/E2eRunner');

var TERMINAL = require('../../src/util/Terminal');

var USAGE = 'usage: unittestscad <file>';

var runner = new E2eRunner([
  new E2eTest('should ask for config file', undefined, [
    USAGE, 
    'Must specify a configuration file when calling UnitTestSCAD.'
  ], 1),
  new E2eTest('should say it does not exist', 'fake.json', [
    USAGE,
    'The supplied path to the configuration file does not point to a valid configuration file.'
  ], 1),
  new E2eTest('should say it is invalid', 'invalid.json', [
    USAGE, 
    'The supplied path to the configuration file does not point to a valid configuration file.'
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
    TERMINAL.GREEN + '0 failures' + TERMINAL.RESET + ' in 7 assertions.',
    'openScad2DModule:',
    TERMINAL.GREEN + '0 failures' + TERMINAL.RESET + ' in 9 assertions.',
    TERMINAL.GREEN + '0 total failures' + TERMINAL.RESET + ' in 16 total assertions.'
  ]),
  new E2eTest('should use and include correctly', 'use-include/config.json', [
    TERMINAL.GREEN + '0 total failures' + TERMINAL.RESET + ' in 3 total assertions.'
  ]),
  new E2eTest('should report', 'reporters/config.json', [
    'Results written to JsonOutput.json',
    'Results written to XmlOutput.xml',
    'Hello, custom reporter working.'
  ], 0, [function(test) {
    var base = './spec/e2e/resources/reporters/';
    var utf8 = 'utf8';

    if(fs.existsSync(base + 'JsonOutput.json')) {
      var json = fs.readFileSync(base + 'JsonOutput.json', utf8);
      var expectedJson = fs.readFileSync(base + 'Expected.json', utf8);

      if(json !== expectedJson) {
        test.failures.push(test.name + ': Expected JsonOutput.json to match Expected.json');
      }

      fs.unlink(base + 'JsonOutput.json');
    } else {
      test.failures.push(test.name + ': Expected JsonOutput.json to be written');
    }

    if(fs.existsSync(base + 'XmlOutput.xml')) {
      var xml = fs.readFileSync(base + 'XmlOutput.xml', utf8);
      var expectedXml = fs.readFileSync(base + 'Expected.xml', utf8);

      if(xml !== expectedXml) {
        test.failures.push(test.name + ': Expected XmlOutput.xml to match Expected.xml');
      }

      fs.unlink(base + 'XmlOutput.xml');
    } else {
      test.failures.push(test.name + ': Expected XmlOutput.xml to be written');
    }
  }])
]);

runner.execute();

module.exports = runner.aggregateFailures();