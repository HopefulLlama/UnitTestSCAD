const fs = require('fs');

const Assertions = require('./Assertions');

function getVertices(parsedOutput) {
  return parsedOutput.path
    .reduce((previousValue, currentValue) => previousValue.concat(currentValue.$.d.match(/(\-*\d+,\-*\d+)/g)), [])
    .map(value => value
      .split(',')
      .map(point => parseFloat(point))
    );
}

module.exports = class extends Assertions {
  constructor() {
    super();
  }

  svgFileToBe(file) {
    return this.__testEquality(this.tester.output, fs.readFileSync(file, 'utf8'));
  }

  heightToBe(expected) {
    return this.__testEquality(parseInt(this.tester.parsedOutput.$.height, 10), expected);
  }

  widthToBe(expected) {
    return this.__testEquality(parseInt(this.tester.parsedOutput.$.width, 10), expected);
  }

  toHaveVertexCountOf(count) {
    return this.__testEquality(getVertices(this.tester.parsedOutput).length, count);
  }

  toBeWithinBoundingBox(vectors) {
    return this.__testWithinBounds(getVertices(this.tester.parsedOutput), vectors);
  }

  toContainVertices(subsetVertices) {
  return this.__testAsymmetricDifference(getVertices(this.tester.parsedOutput), subsetVertices);
  }

  toHaveExactVertices(expectedVertices) {
    return this.__testSymmetricDifference(getVertices(this.tester.parsedOutput), expectedVertices);
  }
};