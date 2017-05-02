var fs = require('fs');

var TestSuite = require('./TestSuite');
var Test = require('./Test');
var ScadHandler = require('./ScadHandler');

var CONFIG = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
var TEMP = "temp.scad";
var STL = "temp.stl";

var regexEscape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var stringContainsSubstring = function(string, substring) {
  return string.search(new RegExp(regexEscape(substring))) < 0;
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

global.assert = {
  "openScadFunction": function(testText) {
    return {
      "outputToBe": function(expectedText) {
        ScadHandler.writeScadFile(CONFIG.openScadDirectory, TEMP, 'echo("UnitTestSCAD");\necho(' + testText + ');');
        output = ScadHandler.execTemp(STL, TEMP);
        output = ScadHandler.getOutputLine(output.split("\n"));

        global.currentTest.assertions++;
        if(stringContainsSubstring(output, expectedText)) {
          global.currentTest.failures++;
        }
      }
    }
  },
  "openScadModule": function(testText) {
    return {
      "stlFileToBe": function(file) {
        ScadHandler.writeScadFile(CONFIG.openScadDirectory, TEMP, testText + ';');
        ScadHandler.execTemp(STL, TEMP);

        global.currentTest.assertions++;

        var output = fs.readFileSync(STL, 'utf8');
        var expected = fs.readFileSync(file, 'utf8');

        if(output !== expected) {
          global.currentTest.failures++;
        }
        fs.unlink(STL);
      }
    }
  }
};

CONFIG.testFiles.forEach(function(file) {
  require(file);
});

global.UnitTestSCAD.forEach(function(testSuite) {
  testSuite.tests.forEach(function(test) {
    console.log(testSuite.name + ": " + test.title + ":\n    " + test.failures + " failures in " + test.assertions + " assertions.");
  });

  fs.unlink(TEMP);
});