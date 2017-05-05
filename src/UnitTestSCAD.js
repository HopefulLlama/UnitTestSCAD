#!/usr/bin/env node

var fs = require('fs');
var os = require('os');
var path = require('path');

var TestSuite = require('./TestSuite');
var Test = require('./Test');
var ScadHandler = require('./util/ScadHandler');
var Tester = require('./tester/Tester');
var FunctionAssertions = require('./tester/FunctionAssertions');
var ModuleAssertions = require('./tester/ModuleAssertions');
var ErrorHandler = require('./util/ErrorHandler');

var configFile = process.argv[2];

var CONFIG;
var TEMP = "temp.scad";
var STL = "temp.stl";

global.UnitTestSCAD = [];
global.currentTestSuite = null;
global.currentTest = null;

global.testSuite = function(name, options, callback) {
  global.UnitTestSCAD.push(new TestSuite(name, options.use, options.include));
  callback();
};

global.it = function(title, callback) {
  global.currentTestSuite.tests.push(new Test(title));
  callback();
};

var createTester = function(AssertionsClazz, testText, test) {
	var tester = new Tester(testText,test, new AssertionsClazz());
	tester.generateStlFile(CONFIG.openScadDirectory, TEMP, STL);
	return tester.assertions;
};

var wrapFunctionText = function(testText) {
	return 'echo("UnitTestSCAD");' + os.EOL + "echo(" + testText + ")";
};

var functionTester = function(testText) {
	return createTester(FunctionAssertions, wrapFunctionText(testText), global.currentTest);
};

var moduleTester = function(testText) {
	return createTester(ModuleAssertions, testText, global.currentTest);
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
    if(totalFailures > 0) {
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.ASSERTION_FAILURES);
    }

    // fs.unlink(temporaryFile);
    // fs.unlink(stlFile);
  } else {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
};

main(configFile, TEMP, STL);