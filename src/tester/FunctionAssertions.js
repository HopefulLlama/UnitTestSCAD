var fs = require('fs');
var os = require('os');
var util = require('util');

var Assertions = require('./Assertions');
var FileHandler = require('../util/FileHandler');
var Tester = require('./Tester');
var TypeConverter = require('../util/TypeConverter');

function FunctionAssertions() {
  Assertions.apply(this);
}

util.inherits(FunctionAssertions, Assertions);

FunctionAssertions.prototype.outputToBe = function(expectedText) {
  return this.__testEquality(this.tester.output, expectedText);
};

FunctionAssertions.prototype.typeToBe = function(expectedType) {
	return this.__testEquality(TypeConverter(this.tester.output), expectedType);
};

module.exports = FunctionAssertions;