#!/usr/bin/env node

var fs = require('fs');
var os = require('os');
var path = require('path');

var ErrorHandler = require('./util/ErrorHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var ScadHandler = require('./util/ScadHandler');
var Test = require('./test/Test');
var TestRunner = require('./test/TestRunner');
var TestSuite = require('./test/TestSuite');

var configFile = process.argv[2];

var CONFIG;
var SCAD = 'temp.scad';
var STL = 'temp.stl';
var TEST_RUNNER = new TestRunner();


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
  tester.generateOutput(CONFIG.openScadDirectory, SCAD, STL);
	return tester.assertions;
};

var moduleTester = function(testText) {
  var tester = new ModuleTester(testText + ';', TEST_RUNNER.current.test);
  tester.generateOutput(CONFIG.openScadDirectory, SCAD, STL);
  return tester.assertions;
};

global.assert = {
  'openScadFunction': functionTester,
  'openScadModule': moduleTester
};

var main = function(configFile, temporaryFile, stlFile) {
  if(configFile) {
    try {
      CONFIG = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } catch (a) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
    }
    process.chdir(path.dirname(configFile));

    CONFIG.testFiles.forEach(function(file) {
      var pathToFile = path.resolve(file);
      require(pathToFile);
    });

    var totalAssertions = 0;
    var totalFailures = 0;

    TEST_RUNNER.testSuites.forEach(function(testSuite) {
      testSuite.tests.forEach(function(test) {
        totalAssertions += test.assertions;
        totalFailures += test.failures.length;

        console.log(testSuite.name + ': ' + test.title + ':' +  os.EOL + '    ' + test.failures.length + ' failures in ' + test.assertions + ' assertions.');
        console.log('    ' + test.failures.join('\n    ') + '\n');
      });
    });

    console.log(totalFailures + ' total failures in ' +  totalAssertions + ' total assertions.');

    fs.unlink(temporaryFile);
    fs.unlink(stlFile);   

    if(totalFailures > 0) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
    }
  } else {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
};

main(configFile, SCAD, STL);