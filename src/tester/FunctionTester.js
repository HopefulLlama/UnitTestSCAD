var fs = require('fs');
var os = require('os');
var util = require('util');

var FunctionAssertions = require('./FunctionAssertions');
var Tester = require('./Tester');

function FunctionTester(testText, test) {
	testText = 'echo("UnitTestSCAD");' + os.EOL + 'echo(' + testText + ')';
	Tester.call(this, testText, test, new FunctionAssertions());
}

util.inherits(FunctionTester, Tester);

FunctionTester.prototype.generateOutput = function(openScadDirectory) {
  this.scadHandler.writeScadFile(this.test.testSuite.getHeader(openScadDirectory), this.testText + ';');
  this.output = this.scadHandler.executeConversion();
};

module.exports = FunctionTester;