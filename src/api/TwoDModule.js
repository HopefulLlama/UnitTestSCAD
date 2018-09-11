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

module.exports = class extends AbstractModule {
  constructor(dirtyOptions) {
    super(dirtyOptions, TwoDModuleFile);

    xml2js.parseString(this.output, (error, result) => {
      if(error) {
        throw new Error(error);
      } else {
        this.parsedOutput = result.svg;

        this.vertices = getVertices(this.parsedOutput);
        this.height = parseInt(this.parsedOutput.$.height, 10);
        this.width = parseInt(this.parsedOutput.$.width, 10);
      }
    });
  }
};