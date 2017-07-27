var fs = require('fs');
var util = require('util');

var FileHandler = require('../util/FileHandler');
var Assertions = require('./Assertions');

function TwoDModuleAssertions() {
  Assertions.apply(this);
}

util.inherits(TwoDModuleAssertions, Assertions);

TwoDModuleAssertions.prototype.svgFileToBe = function(file) {
  return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
};

TwoDModuleAssertions.prototype.heightToBe = function(expected) {
  return this.__testEquality(parseInt(this.tester.parsedOutput.$.height, 10), expected);
};

TwoDModuleAssertions.prototype.widthToBe = function(expected) {
  return this.__testEquality(parseInt(this.tester.parsedOutput.$.width, 10), expected);
};

function getVertices(parsedOutput) {
  return parsedOutput.path.reduce(function(previousValue, currentValue) {
    return previousValue.concat(currentValue.$.d.match(/(\-*\d+,\-*\d+)/g));
  }, [])
  .map(function(value) {
    return value.split(',')
    .map(function(point) {
    	return parseFloat(point);
    });
  });
}

TwoDModuleAssertions.prototype.toHaveVertexCountOf = function(count) {
  return this.__testEquality(getVertices(this.tester.parsedOutput).length, count);
};

TwoDModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  return this.__testWithinBounds(getVertices(this.tester.parsedOutput), vectors);
};

TwoDModuleAssertions.prototype.toContainVertices = function(subsetVertices) {
	return this.__testAsymmetricDifference(getVertices(this.tester.parsedOutput), subsetVertices);
};

TwoDModuleAssertions.prototype.toHaveExactVertices = function(expectedVertices) {
	return this.__testSymmetricDifference(getVertices(this.tester.parsedOutput), expectedVertices);
};

module.exports = TwoDModuleAssertions;