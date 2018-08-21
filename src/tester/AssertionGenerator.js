const FunctionTester = require('./FunctionTester');
const ModuleTester = require('./ModuleTester');
const TwoDModuleTester = require('./TwoDModuleTester');

module.exports = class {
  constructor(config, testRunner) {
    this.__setUp = null;

    this.__config = config;
    this.__testRunner = testRunner;
  }

  withSetup(text) {
    this.__setUp = text;
    return this;
  }

  createAssertions(clazz, testText) {
    const tester = new clazz(this.__setUp, testText, this.__testRunner.current.test);
    tester.generateOutput(this.__config.properties.openScadDirectory);

    this.__setUp = null;

    return tester.assertions;
  }

  openScadFunction(testText) {
    return this.createAssertions(FunctionTester, testText);
  }

  openScadModule(testText) {
    return this.createAssertions(ModuleTester, testText);
  }

  openScad3DModule(testText) {
    return this.openScadModule(testText);
  }

  openScad2DModule(testText) {
    return this.createAssertions(TwoDModuleTester, testText);
  }
};