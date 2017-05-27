var fs = require('fs');
var util = require('util');

var ScadHandler = require('../util/ScadHandler');
var Assertions = require('./Assertions');

function FunctionAssertions() {
	Assertions.apply(this);
}

util.inherits(FunctionAssertions, Assertions);

FunctionAssertions.prototype.outputToBe = function(expectedText) {
	return this.__testContains(this.tester.output, expectedText);
};

module.exports = FunctionAssertions;