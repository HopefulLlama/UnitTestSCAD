#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var AssertionGenerator = require('./tester/AssertionGenerator');
var ErrorHandler = require('./util/ErrorHandler');
var FileHandler = require('./util/FileHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var ReporterRegistry = require('./reporter/ReporterRegistry');
var Test = require('./test/Test');
var TestSuite = require('./test/TestSuite');
var OpenScadType = require('./constants/OpenScadType');

var TEST_RUNNER = require('./test/TestRunner');

var CONFIG = {};

function setUpGlobals(config, testRunner) {
  global.OpenScadType = OpenScadType;
  global.ReporterRegistry = ReporterRegistry;

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
}

function readConfig(pathToConfig) {
  return {
    'path': pathToConfig,
    'properties': JSON.parse(fs.readFileSync(pathToConfig, 'utf8'))
  };
}

function main(config, testRunner) {
  process.chdir(path.dirname(config.path));

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
    ErrorHandler.throwErrorAndSetExitCode(ErrorHandler.REASONS.ASSERTION_FAILURES);
  }
}

function run(pathToConfig) {
  process.on('exit', function(code) {
    FileHandler.cleanUp();
  });

  if(pathToConfig) {
    try {
      CONFIG = readConfig(pathToConfig);
    } catch(err) {
      ErrorHandler.throwErrorAndSetExitCode(ErrorHandler.REASONS.INVALID_CONFIG);
      return;
    }

    setUpGlobals(CONFIG, TEST_RUNNER);
    main(CONFIG, TEST_RUNNER);
  } else {
    ErrorHandler.throwErrorAndSetExitCode(ErrorHandler.REASONS.MISSING_CONFIG);
  }
}

if (require.main === module) {
  var pathToConfig = process.argv[2];

  run(pathToConfig);
} else {
  module.exports = run;
}