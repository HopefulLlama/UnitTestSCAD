var FunctionTester = require('./FunctionTester');
var ModuleTester = require('./ModuleTester');
var TwoDModuleTester = require('./TwoDModuleTester');

function AssertionGenerator(config, testRunner) {
  this.__setUp = null;

  this.__config = config;
  this.__testRunner = testRunner;
}

AssertionGenerator.prototype.withSetup = function(text) {
  this.__setUp = text;
  return this;
};

AssertionGenerator.prototype.createAssertions = function(clazz, testText) {
  var tester = new clazz(this.__setUp, testText, this.__testRunner.current.test);
  tester.generateOutput(this.__config.properties.openScadDirectory);

  this.__setUp = null;

  return tester.assertions;
};

AssertionGenerator.prototype.openScadFunction = function(testText) {
  return this.createAssertions(FunctionTester, testText);
};

AssertionGenerator.prototype.openScadModule = function(testText) {
  return this.createAssertions(ModuleTester, testText);
};

AssertionGenerator.prototype.openScad3DModule = function(testText) {
  return this.openScadModule(testText);
};

AssertionGenerator.prototype.openScad2DModule = function(testText) {
  return this.createAssertions(TwoDModuleTester, testText);
};

module.exports = AssertionGenerator;