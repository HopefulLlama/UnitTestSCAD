const xml2js = require('xml2js');

const AbstractModule = require('./AbstractModule');
const TwoDModuleFile = require('../file/TwoDModuleFile');

function getVertices(parsedOutput) {
  return parsedOutput.path
    .reduce((previousValue, currentValue) => {
      return previousValue.concat(currentValue.$.d.match(/(-*\d+,-*\d+)/g));
    }, [])
    .map(value => value
      .split(',')
      .map(point => parseFloat(point))
    );
}

/** @class */
class TwoDModule extends AbstractModule {
  /**
   * @param {Options} options
   */
  constructor(options) {
    super(options, TwoDModuleFile);

    /**
     * @memberof TwoDModule
     * @instance
     * @member {string} output The extracted output from execution of the .scad file.
     */

    /**
     * @memberof TwoDModule
     * @instance
     * @function
     * @name isWithinBoundingBox
     * @param boundingBox {BoundingBox} The 2D box which the model should fit inside. It is considered 'within' if any coordinate is equal to, or within the box.
     * @returns {boolean} True if the model fits within the bounding box.
     */

    xml2js.parseString(this.output, (error, result) => {
      if(error) {
        throw new Error(error);
      } else {
        /**
         * @memberof TwoDModule
         * @instance
         * @member {Vertex[]} vertices A list of 2D vertices returned from the .scad file execution.
         */
        this.vertices = getVertices(result.svg);

        /**
         * @memberof TwoDModule
         * @instance
         * @member {number} height The height of the model.
         */
        this.height = parseInt(result.svg.$.height, 10);
        /**
         * @memberof TwoDModule
         * @instance
         * @member {number} width The width of the model.
         */
        this.width = parseInt(result.svg.$.width, 10);
      }
    });
  }
}

module.exports = TwoDModule;