var fs = require('fs');

var ScadHandler = require('../util/ScadHandler');

function ModuleAssertions() {
  this.tester = null;
}

ModuleAssertions.prototype.stlFileToBe = function(file) {
  this.tester.test.assertions++;
  var expected = fs.readFileSync(file, 'utf8');

  if(this.parent.output !== expected) {
    this.test.failures++;
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
  this.tester.test.assertions++;
  if(ScadHandler.getVertices(this.tester.output).length !== expectedCount) {
    this.tester.test.failures++;
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
	this.tester.test.assertions++;
	if(ScadHandler.countTriangles(this.tester.output) !== expectedCount) {
		this.tester.test.failures++;
	}

	return {
		'and': this
	};
};

var isCoordinateWithinBounds = function(coordinate, min, max) {
  return coordinate >= min || coordinate <= max;
};

ModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  var failingVertices = 0;
  this.tester.test.assertions++;

  ScadHandler.getVertices(this.tester.output)
  .forEach(function(vertex) {
    vertex.forEach(function(coordinate, index) {
      if(!isCoordinateWithinBounds(coordinate, vectors[0][index], vectors[1][index])) {
        failingVertices++;
      }
    });
  });

  if(failingVertices > 0) {
    this.tester.test.failures++;
  }

  return {
    'and': this
  };
};

module.exports = ModuleAssertions;