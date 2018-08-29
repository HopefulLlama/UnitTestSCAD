const fs = require('fs');
const os = require('os');

const Assertions = require('./Assertions');

function getDimensionSize(contents, index) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  getVertices(contents).forEach(vertex => {
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

function getLinesWithVertex(contents) {
  return contents
    .split(os.EOL)
    .filter(line => line.match(/vertex([ ]{1}[0-9]+[.]*[0-9]*){3}/));
}

function getVertices(contents) {
  return getLinesWithVertex(contents)
    .filter((value, index, self) => self.indexOf(value) === index)
      // Last three elements should be the co-ordinates, as a string
    .map(currentValue => currentValue
      .split(' ')
      .slice(-3)
      .map(vertex => parseFloat(vertex, 10))
    );
}

function countTriangles(contents) {
  return contents
    .split(os.EOL)
    .filter(line => line.match(/endfacet/))
    .length;
}

module.exports = class extends Assertions {
  constructor() {
    super();
  }

  stlFileToBe(file) {
    return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
  }

  toHaveVertexCountOf(expectedCount) {
    return this.__testEquality(getVertices(this.tester.output).length, expectedCount);
  }

  toHaveTriangleCountOf(expectedCount) {
    return this.__testEquality(countTriangles(this.tester.output), expectedCount);
  }

  toBeWithinBoundingBox(vectors) {
    return this.__testWithinBounds(getVertices(this.tester.output), vectors);
  }

  widthToBe(expectedWidth) {
    return this.__testEquality(getWidth(this.tester.output), expectedWidth);
  }

  heightToBe(expectedHeight) {
    return this.__testEquality(getHeight(this.tester.output), expectedHeight);
  }

  depthToBe(expectedDepth) {
    return this.__testEquality(getDepth(this.tester.output), expectedDepth);
  }

  toContainVertices(subsetVertices) {
    return this.__testAsymmetricDifference(getVertices(this.tester.output), subsetVertices);
  }

  toHaveExactVertices(expectedVertices) {
    return this.__testSymmetricDifference(getVertices(this.tester.output), expectedVertices);
  }
};