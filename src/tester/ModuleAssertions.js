var fs = require('fs');

var ScadHandler = require('../util/ScadHandler');

function ModuleAssertions() {
  this.tester = null;
}

ModuleAssertions.prototype.stlFileToBe = function(file) {
  this.tester.test.assertions++;
  var expected = fs.readFileSync(file, 'utf8');

  if(this.tester.output !== expected) {
    this.tester.test.failures.push('Expected "' + this.tester.output + '" to be "' + expected + '".');
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
  this.tester.test.assertions++;
  var vertices = ScadHandler.getVertices(this.tester.output).length;
  if(vertices !== expectedCount) {
    this.tester.test.failures.push('Expected ' + vertices + ' to be ' + expectedCount + '.');
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
	this.tester.test.assertions++;
  var triangles = ScadHandler.countTriangles(this.tester.output);
	if(triangles !== expectedCount) {
		this.tester.test.failures.push('Expected ' + triangles + ' to be ' + expectedCount + '.');
	}

	return {
		'and': this
	};
};

var isCoordinateWithinBounds = function(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
};

ModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  var failingVertices = 0;
  this.tester.test.assertions++;
  var vertices = ScadHandler.getVertices(this.tester.output);

  vertices.forEach(function(vertex) {
    vertex.forEach(function(coordinate, index) {
      if(!isCoordinateWithinBounds(coordinate, vectors[0][index], vectors[1][index])) {
        failingVertices++;
      }
    });
  });

  if(failingVertices > 0) {
    this.tester.test.failures.push('Expected ' + vertices + ' to be within the bounds of ' + vectors + '.');
  }

  return {
    'and': this
  };
};

module.exports = ModuleAssertions;