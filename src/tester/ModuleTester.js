const FileHandler = require('../util/FileHandler');
const ModuleAssertions = require('./ModuleAssertions');
const Tester = require('./Tester');

module.exports = class extends Tester {
  constructor(setUpText, testText, test) {
    super(setUpText, testText, test, new ModuleAssertions());
  }

  generateOutput(openScadDirectory) {
    this.generateScadFile(openScadDirectory);
    this.output = FileHandler.getStlContent();
  }
};