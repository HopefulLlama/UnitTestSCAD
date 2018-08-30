const {EOL} = require('os');

const AbstractModule = require('./AbstractModule');
const ThreeDModuleFile = require('../file/ThreeDModuleFile');

function getDimensionSize(vertices, index) {
  const range = vertices.reduce((accumulator, vertex) => {
    return {
      min: vertex[index] < accumulator.min ? vertex[index] : accumulator.min,
      max: vertex[index] > accumulator.max ? vertex[index] : accumulator.max,
    };
  }, {
    min: Number.POSITIVE_INFINITY,
    max: Number.NEGATIVE_INFINITY
  });

  return range.max - range.min;
}

function getVertices(contents) {
  return contents
    .split(EOL)
    .filter(line => line.match(/vertex([ ][0-9]+[.]*[0-9]*){3}/))
    .filter((value, index, self) => self.indexOf(value) === index)
      // Last three elements should be the co-ordinates, as a string
    .map(vectorString => vectorString
      .split(' ')
      .slice(-3)
      .map(vertex => parseFloat(vertex, 10))
    );
}

function getTriangleCount(contents) {
  return contents
    .split(EOL)
    .filter(line => line.match(/endfacet/))
    .length;
}

module.exports = class extends AbstractModule {
  constructor(options) {
    super(options, ThreeDModuleFile);
    this.vertices = getVertices(this.output);

    this.width = getDimensionSize(this.vertices, 0);
    this.height = getDimensionSize(this.vertices, 1);
    this.depth = getDimensionSize(this.vertices, 2);

    // List of triangles rather than count pls
    this.triangleCount = getTriangleCount(this.output);
  }
};
