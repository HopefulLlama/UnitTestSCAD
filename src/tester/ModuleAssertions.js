var fs = require('fs');
var os = require('os');
var util = require('util');

var FileHandler = require('../util/FileHandler');
var Assertions = require('./Assertions');

function ModuleAssertions() {
  Assertions.apply(this);
}

util.inherits(ModuleAssertions, Assertions);

function getLinesWithVertex(contents) {
  return contents.split(os.EOL)
  .filter(function(line) {
    return line.match(/vertex([ ]{1}[0-9]+[.]*[0-9]*){3}/);
  });
}

function getVertices(contents) {
  return getLinesWithVertex(contents)
  .filter(function(value, index, self) {
    return self.indexOf(value) === index;
  })
  .reduce(function(accumulator, currentValue) {
    // Last three elements should be the co-ordinates, as a string
    var vertex = currentValue.split(' ')
    .slice(-3)
    .map(function(v) {
      return parseFloat(v, 10);
    });
    accumulator.push(vertex);
    return accumulator;
  }, []);
}

function countTriangles(contents) {
  return contents.split(os.EOL)
  .filter(function(line) {
    return line.match(/endfacet/);
  })
  .length;
}

function getDimensionSize(contents, index) {
  var min = Number.POSITIVE_INFINITY;
  var max = Number.NEGATIVE_INFINITY;

  getVertices(contents).forEach(function(vertex) {
    if(vertex[index] < min) {
      min = vertex[index];
    }
    if(vertex[index] > max) {
      max = vertex[index];
    }
  });

  return max - min;
}

function getWidth(contents) {
  return getDimensionSize(contents, 0);
}

function getHeight(contents) {
  return getDimensionSize(contents, 1);
}

function getDepth(contents) {
  return getDimensionSize(contents, 2);
}

ModuleAssertions.prototype.stlFileToBe = function(file) {
  return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
  return this.__testEquality(getVertices(this.tester.output).length, expectedCount);
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
  return this.__testEquality(countTriangles(this.tester.output), expectedCount); 
};

ModuleAssertions.prototype.toBeWithinBoundingBox = function(vectors) {
  return this.__testWithinBounds(getVertices(this.tester.output), vectors);
};

ModuleAssertions.prototype.widthToBe = function(expectedWidth) {
  return this.__testEquality(getWidth(this.tester.output), expectedWidth);
};

ModuleAssertions.prototype.heightToBe = function(expectedHeight) {
  return this.__testEquality(getHeight(this.tester.output), expectedHeight);
};

ModuleAssertions.prototype.depthToBe = function(expectedDepth) {
  return this.__testEquality(getDepth(this.tester.output), expectedDepth);
};

ModuleAssertions.prototype.toContainVertices = function(subsetVertices) {
  return this.__testAsymmetricDifference(getVertices(this.tester.output), subsetVertices);
};

ModuleAssertions.prototype.toHaveExactVertices = function(expectedVertices) {
  return this.__testSymmetricDifference(getVertices(this.tester.output), expectedVertices);
};

module.exports = ModuleAssertions;