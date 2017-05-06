#!/usr/bin/env node

var fs = require('fs');
var os = require('os');
var path = require('path');

var ErrorHandler = require('./util/ErrorHandler');
var FunctionTester = require('./tester/FunctionTester');
var ModuleTester = require('./tester/ModuleTester');
var ScadHandler = require('./util/ScadHandler');
var Test = require('./Test');
var TestSuite = require('./TestSuite');

var configFile = process.argv[2];

var CONFIG;
var TEMP = "temp.scad";
var STL = "temp.stl";

global.UnitTestSCAD = [];
global.currentTestSuite = null;
global.currentTest = null;

global.testSuite = function(name, options, callback) {
  var testSuite = new TestSuite(name, options.use, options.include);
  global.UnitTestSCAD.push(testSuite);
  global.currentTestSuite = testSuite;
  callback();
};

global.it = function(title, callback) {
  var test = new Test(title, global.currentTestSuite);
  global.currentTestSuite.tests.push(test);
  global.currentTest = test;
  callback();
};

var wrapFunctionText = function(testText) {
	return 'echo("UnitTestSCAD");' + os.EOL + "echo(" + testText + ")";
};

var functionTester = function(testText) {
  var tester = new FunctionTester(wrapFunctionText(testText), global.currentTest);
  tester.generateOutput(CONFIG.openScadDirectory, TEMP, STL);
	return tester.assertions;
};

var moduleTester = function(testText) {
  var tester = new ModuleTester(testText + ';', global.currentTest);
  tester.generateOutput(CONFIG.openScadDirectory, TEMP, STL);
  return tester.assertions;
};

global.assert = {
  "openScadFunction": functionTester,
  "openScadModule": moduleTester
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

    global.UnitTestSCAD.forEach(function(testSuite) {
      testSuite.tests.forEach(function(test) {
        totalAssertions += test.assertions;
        totalFailures += test.failures;

        console.log(testSuite.name + ": " + test.title + ":" +  os.EOL + "    " + test.failures + " failures in " + test.assertions + " assertions.");
      });
    });

    console.log(totalFailures + " total failures in " +  totalAssertions + " total assertions.");

    fs.unlink(temporaryFile);
    fs.unlink(stlFile);   

    if(totalFailures > 0) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
    }
  } else {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
};

main(configFile, TEMP, STL);