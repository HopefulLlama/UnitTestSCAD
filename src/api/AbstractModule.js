const AbstractParent = require('./AbstractParent');

function isCoordinateWithinBounds(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
}

module.exports = class extends AbstractParent {
  constructor(options, file) {
    super(options, file);
  }

  /**
   * @typedef {object} BoundingBox A box in 2D/3D space.
   * @property {Vertex} min A 2D/3D vertex which defines the 'minimum' co-ordinates. This is the corner of the box with the lowest x, y and optional z co-ordinate.
   * @property {Vertex} max A 2D/3D vertex which defines the 'maximum' co-ordinates. This is the corner of the box with the highest x, y and optional z co-ordinate.
   */

  isWithinBoundingBox(boundingBox) {
    const failingVertices = this.vertices.reduce((failingCounter, vertex) => {
      return failingCounter + vertex.reduce((accumulator, coordinate, index) => {
        return isCoordinateWithinBounds(coordinate, boundingBox.min[index], boundingBox.max[index]) ? accumulator : accumulator + 1;
      }, 0);
    }, 0);

    return failingVertices === 0;
  }
};