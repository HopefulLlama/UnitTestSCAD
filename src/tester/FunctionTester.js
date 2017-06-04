var fs = require('fs');
var os = require('os');
var util = require('util');

var FunctionAssertions = require('./FunctionAssertions');
var Tester = require('./Tester');

function FunctionTester(setUpText, testText, test) {
  Tester.call(this, setUpText, Tester.wrapWithMarker(testText), test, new FunctionAssertions());
}
util.inherits(FunctionTester, Tester);

FunctionTester.prototype.generateOutput = function(openScadDirectory) {
  this.FileHandler.writeScadFile(this.test.testSuite.getHeader(openScadDirectory), this.setUpText, this.testText);
  this.output = this.FileHandler.executeConversion();
};

module.exports = FunctionTester;