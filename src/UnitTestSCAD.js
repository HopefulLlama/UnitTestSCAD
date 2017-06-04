#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var AssertionGenerator = require('./tester/AssertionGenerator');
var ErrorHandler = require('./util/ErrorHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var FileHandler = require('./util/FileHandler');
var Test = require('./test/Test');
var TestSuite = require('./test/TestSuite');

var TEST_RUNNER = require('./test/TestRunner');

var CONFIG = {};
var pathToConfig = process.argv[2];


var setUpGlobals = function(config, testRunner) {
  global.ReporterRegistry = require('./reporter/ReporterRegistry');

  global.testSuite = function(name, options, callback) {
    var testSuite = new TestSuite(name, options.use, options.include);

    testRunner.testSuites.push(testSuite);
    testRunner.current.testSuite = testSuite;

    callback();
  };

  global.it = function(title, callback) {
    var test = new Test(title, testRunner.current.testSuite);
    
    testRunner.current.testSuite.tests.push(test);
    testRunner.current.test = test;
    callback();
  };

  global.assert = new AssertionGenerator(config, testRunner);
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

  var reporters = (config.properties.reporters !== undefined) ? config.properties.reporters : [{
    'name': 'console',
    'options': null
  }];
  testRunner.report(reporters);

  if(testRunner.aggregateResults().failures > 0) {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
  }
};

process.on('exit', function(code) {
  FileHandler.cleanUp();
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

setUpGlobals(CONFIG, TEST_RUNNER);
main(CONFIG, TEST_RUNNER);