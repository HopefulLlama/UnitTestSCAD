#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var ErrorHandler = require('./util/ErrorHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var ScadHandler = require('./util/ScadHandler');
var Test = require('./test/Test');
var TestSuite = require('./test/TestSuite');

var TEST_RUNNER = require('./test/TestRunner');

var CONFIG = {};
var pathToConfig = process.argv[2];

global.ReporterRegistry = require('./reporter/ReporterRegistry');

global.testSuite = function(name, options, callback) {
  var testSuite = new TestSuite(name, options.use, options.include);

  TEST_RUNNER.testSuites.push(testSuite);
  TEST_RUNNER.current.testSuite = testSuite;

  callback();
};

global.it = function(title, callback) {
  var test = new Test(title, TEST_RUNNER.current.testSuite);
  
  TEST_RUNNER.current.testSuite.tests.push(test);
  TEST_RUNNER.current.test = test;
  callback();
};

var functionTester = function(testText) {
  var tester = new FunctionTester(testText, TEST_RUNNER.current.test);
  tester.generateOutput(CONFIG.properties.openScadDirectory);
	return tester.assertions;
};

var moduleTester = function(testText) {
  var tester = new ModuleTester(testText + ';', TEST_RUNNER.current.test);
  tester.generateOutput(CONFIG.properties.openScadDirectory);
  return tester.assertions;
};

global.assert = {
  'openScadFunction': functionTester,
  'openScadModule': moduleTester
};

var readConfig = function(pathToConfig) {
  return {
    'path': pathToConfig,
    'properties': JSON.parse(fs.readFileSync(pathToConfig, 'utf8'))
  };
};

var main = function(config, testRunner) {
  process.chdir(path.dirname(pathToConfig));

  if(config.properties.customReporters !== undefined) {
    global.ReporterRegistry.__addCustomReporters(config.properties.customReporters);
  }

  testRunner.runTests(config.properties.testFiles);

  var reporters = (config.properties.reporters !== undefined) ? config.properties.reporters : [
    {
      'name': 'console',
      'options': null
    }
  ];
  testRunner.report(reporters);

  if(testRunner.aggregateResults().failures > 0) {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
  }
};

process.on('exit', function(code) {
	ScadHandler.cleanUp();
});

if(pathToConfig) {
  try {
    CONFIG = readConfig(pathToConfig);
  } catch (a) {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
} else {
  ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.MISSING_CONFIG);
}

main(CONFIG, TEST_RUNNER);