var fs = require('fs');
var os = require('os');
var util = require('util');

var FileHandler = require('../util/FileHandler');
var FunctionAssertions = require('./FunctionAssertions');
var Tester = require('./Tester');

function FunctionTester(setUpText, testText, test) {
  Tester.call(this, setUpText, Tester.wrapWithMarker(testText), test, new FunctionAssertions());
}
util.inherits(FunctionTester, Tester);

function extractText(text) {
	var ECHO = 'ECHO: ';

  content = text.split(os.EOL);
  return content.slice(
    content.indexOf(ECHO + Tester.START_MARKER) + 1,
    content.indexOf(ECHO + Tester.END_MARKER)
  )
  .map(function(line) {
    return line.slice(ECHO.length);
  })
  .join(os.EOL);
}

FunctionTester.prototype.generateOutput = function(openScadDirectory) {
  this.generateScadFile(openScadDirectory);
  this.output = extractText(FileHandler.getStlConversionOutput());
};

module.exports = FunctionTester;