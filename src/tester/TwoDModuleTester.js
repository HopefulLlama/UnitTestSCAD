const xml2js = require('xml2js');

const FileHandler = require('../util/FileHandler');
const Tester = require('./Tester');
const TwoDModuleAssertions = require('./TwoDModuleAssertions');

module.exports = class extends Tester {
  constructor(setUpText, testText, test) {
    super(setUpText, testText, test, new TwoDModuleAssertions());
  }

  generateOutput(openScadDirectory) {
    this.generateScadFile(openScadDirectory);
    this.output = FileHandler.getSvgContent();

    xml2js.parseString(this.output, (error, result) => {
      if(error) {
        throw new Error();
      } else {
        this.parsedOutput = result.svg;
      }
    });
  }
};