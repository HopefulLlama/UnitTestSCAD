#!/usr/bin/env node

var ErrorHandler = require('./util/ErrorHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var ScadHandler = require('./util/ScadHandler');
var Test = require('./test/Test');
var TestSuite = require('./test/TestSuite');

var TEST_RUNNER = require('./test/TestRunner');

var configFile = process.argv[2];

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
  tester.generateOutput(TEST_RUNNER.config.properties.openScadDirectory);
	return tester.assertions;
};

var moduleTester = function(testText) {
  var tester = new ModuleTester(testText + ';', TEST_RUNNER.current.test);
  tester.generateOutput(TEST_RUNNER.config.properties.openScadDirectory);
  return tester.assertions;
};

global.assert = {
  'openScadFunction': functionTester,
  'openScadModule': moduleTester
};

var main = function(configFile, testRunner) {
  if(configFile) {
    try {
      testRunner.readConfig(configFile);
    } catch (a) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
    }
    testRunner.runTests();
    var results = testRunner.aggregateResults();

    // Candidiate for being moved to a 'Reporter' class?
    results.summaries.forEach(function(summary) {
      console.log(summary);
    });

    console.log(results.failures + ' total failures in ' +  results.assertions + ' total assertions.'); 

    if(results.failures > 0) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
    }
  } else {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
};

process.on('exit', function(code) {
	ScadHandler.cleanUp();
});

main(configFile, TEST_RUNNER);