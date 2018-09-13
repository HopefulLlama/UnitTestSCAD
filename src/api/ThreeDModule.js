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

function getVertex(content) {
  return content
    .split(' ')
    // Last three elements should be the co-ordinates, as a string
    .slice(-3)
    .map(vertex => parseFloat(vertex, 10));
}

function getVertices(contents) {
  const vertexRegex = new RegExp(/vertex([ ][0-9]+[.]*[0-9]*){3}/, 'gm');

  return contents
    .match(vertexRegex)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(vertexString => getVertex(vertexString));
}

function getTriangles(contents) {
  const triangleRegex = new RegExp(/outer loop[\s\S]+?endloop/, 'g');

  return contents
    .match(triangleRegex)
    .map(triangleString => triangleString.split(EOL))
    .map(triangleStrings => triangleStrings.splice(1, 3))
    .map(verticesOfTriangleStrings => {
      return verticesOfTriangleStrings.map(vertexString => getVertex(vertexString));
    });
}

/** @class */
class ThreeDModule extends AbstractModule {
  /** @param {Options} options */
  constructor(options) {
    super(options, ThreeDModuleFile);
    /**
     * @memberof ThreeDModule
     * @instance
     * @member {string} output The extracted output from execution of the .scad file.
     */

    /**
     * @memberof ThreeDModule
     * @instance
     * @function
     * @name isWithinBoundingBox
     * @param boundingBox {BoundingBox} The 3D box which the model should fit inside. It is considered 'within' if any coordinate is equal to, or within the box.
     * @returns {boolean} True if the model fits within the bounding box.
     */

    /**
     * @memberof ThreeDModule
     * @instance
     * @member {Vertex[]} vertices A list of 3D vertices returned from the .scad file execution.
     */
    this.vertices = getVertices(this.output);

    /**
     * @memberof ThreeDModule
     * @instance
     * @member {number} width The width of the model.
     */
    this.width = getDimensionSize(this.vertices, 0);

    /**
     * @memberof ThreeDModule
     * @instance
     * @member {number} height The height of the model.
     */
    this.height = getDimensionSize(this.vertices, 1);

    /**
     * @memberof ThreeDModule
     * @instance
     * @member {number} depth The depth of the model.
     */
    this.depth = getDimensionSize(this.vertices, 2);

    /**
     * @typedef {Vertex[]} Triangle An array of three 3D vertices which describe a triangle. See {@link https://en.wikipedia.org/wiki/Triangle_mesh}.
     */

    /**
     * @memberof ThreeDModule
     * @instance
     * @member {Triangle[]} triangles The triangles which make up the model. See {@link https://en.wikipedia.org/wiki/Triangle_mesh}.
     */
    this.triangles = getTriangles(this.output);
  }
}

module.exports = ThreeDModule;