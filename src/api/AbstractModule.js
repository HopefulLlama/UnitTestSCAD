const AbstractParent = require('./AbstractParent');

function isCoordinateWithinBounds(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
}

module.exports = class extends AbstractParent {
  constructor(options, file) {
    super(options, file);
  }

  isWithinBoundingBox(vectors) {
    const failingVertices = this.vertices.reduce((failingCounter, vertex) => {
      return failingCounter + vertex.reduce((prevValue, coordinate, index) => {
        return isCoordinateWithinBounds(coordinate, vectors[0][index], vectors[1][index]) ? prevValue : prevValue + 1;
      }, 0);
    }, 0);

    return failingVertices === 0;
  }
};