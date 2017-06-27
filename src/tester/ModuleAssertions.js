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
    return line.match(/vertex([ ]{1}[0-9]*){3}/);
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
      return parseInt(v, 10);
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

module.exports = ModuleAssertions;