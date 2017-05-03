#!/usr/bin/env node

var fs = require('fs');
var os = require('os');

var TestSuite = require('./TestSuite');
var Test = require('./Test');
var ScadHandler = require('./ScadHandler');
var ErrorHandler = require('./util/ErrorHandler');

var configFile = process.argv[2];

var CONFIG;
var TEMP = "temp.scad";
var STL = "temp.stl";

var regexEscape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var stringContainsSubstring = function(string, substring) {
  return string.search(new RegExp(regexEscape(substring))) > 0;
};

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
}

var functionTester = function(testText) {
  ScadHandler.writeScadFile(CONFIG.openScadDirectory, TEMP, 'echo("UnitTestSCAD");' + os.EOL + 'echo(' + testText + ');');
  output = ScadHandler.execTemp(STL, TEMP);
  output = ScadHandler.getOutputLine(output.split(os.EOL));
  
  return {
    "outputToBe": function(expectedText) {
      global.currentTest.assertions++;
      if(!stringContainsSubstring(output, expectedText)) {
        global.currentTest.failures++;
      }
    }
  }
};

var moduleTester = function(testText) {
  ScadHandler.writeScadFile(CONFIG.openScadDirectory, TEMP, testText + ';');
  ScadHandler.execTemp(STL, TEMP);
  
  var output = fs.readFileSync(STL, 'utf8');

  return {
    "stlFileToBe": function(file) {
      global.currentTest.assertions++;
      var expected = fs.readFileSync(file, 'utf8');

      if(output !== expected) {
        global.currentTest.failures++;
      }
    },
    "toHaveVertexCountOf": function(expectedCount) {
      global.currentTest.assertions++;
      if(ScadHandler.countVertices(output) !== expectedCount) {
        global.currentTest.failures++;
      }
    }
  }
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
    CONFIG.testFiles.forEach(function(file) {
      require(file);
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
      ErrorHandler.throwErrorAndExit(ErrorHandler.REASON.ASSERTION_FAILURES);
    }

    fs.unlink(temporaryFile);
    fs.unlink(stlFile);
  } else {
    ErrorHandler.throwErrorAndExit(ErrorHandler.REASONS.INVALID_CONFIG);
  }
};

main(configFile, TEMP, STL);