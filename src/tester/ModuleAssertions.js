var fs = require('fs');
var util = require('util');

var FileHandler = require('../util/FileHandler');
var Assertions = require('./Assertions');

function ModuleAssertions() {
  Assertions.apply(this);
}

util.inherits(ModuleAssertions, Assertions);

ModuleAssertions.prototype.stlFileToBe = function(file) {
  return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
  return this.__testEquality(FileHandler.getVertices(this.tester.output).length, expectedCount);
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
  return this.__testEquality(FileHandler.countTriangles(this.tester.output), expectedCount); 
};
ModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  return this.__testWithinBounds(FileHandler.getVertices(this.tester.output), vectors);
};

module.exports = ModuleAssertions;