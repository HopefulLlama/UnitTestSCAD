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

FunctionTester.prototype.generateOutput = function(openScadDirectory) {
  this.generateScadFile(openScadDirectory);
  this.output = FileHandler.getStlConversionOutput();
};

module.exports = FunctionTester;