#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const AssertionGenerator = require('./tester/AssertionGenerator');
const ErrorHandler = require('./util/ErrorHandler');
const FileHandler = require('./util/FileHandler');
const ReporterRegistry = require('./reporter/ReporterRegistry');
const Test = require('./test/Test');
const TestSuite = require('./test/TestSuite');
const OpenScadType = require('./constants/OpenScadType');

const TEST_RUNNER = require('./test/TestRunner');

let CONFIG = {};

winston
  .remove(winston.transports.Console)
  .add(winston.transports.Console, {'showLevel': false});

function setUpGlobals(config, testRunner) {
  global.OpenScadType = OpenScadType;
  global.ReporterRegistry = ReporterRegistry;

  global.testSuite = (name, options, callback) => {
    const testSuite = new TestSuite(name, options.use, options.include);

    testRunner.testSuites.push(testSuite);
    testRunner.current.testSuite = testSuite;

    callback();
  };

  global.it = (title, callback) => {
    const test = new Test(title, testRunner.current.testSuite);

    testRunner.current.testSuite.tests.push(test);
    testRunner.current.test = test;
    callback();
  };

  global.assert = new AssertionGenerator(config, testRunner);
}

function readConfig(pathToConfig) {
  return {
    path: pathToConfig,
    properties: JSON.parse(fs.readFileSync(pathToConfig, 'utf8'))
  };
}

function main(config, testRunner) {
  process.chdir(path.dirname(config.path));

  try {
    if(config.properties.customReporters !== undefined) {
      global.ReporterRegistry.__addCustomReporters(config.properties.customReporters);
    }

    testRunner.runTests(config.properties.testFiles);
  } catch(error) {
    winston.error(`${error.name}: ${error.message}`);
    ErrorHandler.throwErrorAndSetExitCode(ErrorHandler.REASONS.FILE_EXECUTION_ERROR);
    return;
  }

  const reporters = (config.properties.reporters !== undefined) ? config.properties.reporters : [{
    name: 'console',
    options: null
  }];
  testRunner.report(reporters);

  if(testRunner.aggregateResults().failures > 0) {
    ErrorHandler.throwErrorAndSetExitCode(ErrorHandler.REASONS.ASSERTION_FAILURES);
  }
}

function run(pathToConfig) {
  process.on('exit', () => FileHandler.cleanUp());

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
  const pathToConfig = process.argv[2];

  run(pathToConfig);
} else {
  module.exports = run;
}