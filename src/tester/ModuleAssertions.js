var fs = require('fs');
var util = require('util');

var ScadHandler = require('../util/ScadHandler');
var Assertions = require('./Assertions');

function ModuleAssertions() {
	Assertions.apply(this);
}

util.inherits(ModuleAssertions, Assertions);

ModuleAssertions.prototype.stlFileToBe = function(file) {
  return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
	return this.__testEquality(ScadHandler.getVertices(this.tester.output).length, expectedCount);
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
	return this.__testEquality(ScadHandler.countTriangles(this.tester.output), expectedCount); 
};

var isCoordinateWithinBounds = function(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
};

ModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  var failingVertices = 0;
  var vertices = ScadHandler.getVertices(this.tester.output);

  vertices.forEach(function(vertex) {
    vertex.forEach(function(coordinate, index) {
      if(!isCoordinateWithinBounds(coordinate, vectors[0][index], vectors[1][index])) {
        failingVertices++;
      }
    });
  });

  return this.__test(vertices, 'to be within the bounds of', vectors, function(dis) {
  	return failingVertices === 0;
  });
};

module.exports = ModuleAssertions;