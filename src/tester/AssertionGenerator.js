var FunctionTester = require('./FunctionTester');
var ModuleTester = require('./ModuleTester');

function AssertionGenerator(config, testRunner) {
  this.__setUp = null;

  this.__config = config;
  this.__testRunner = testRunner;
}

AssertionGenerator.prototype.withSetup = function(text) {
  this.__setUp = text;
  return this;
};

AssertionGenerator.prototype.openScadFunction = function(testText) {
  var tester = new FunctionTester(this.__setUp, testText, this.__testRunner.current.test);
  tester.generateOutput(this.__config.properties.openScadDirectory);

  this.__setUp = null;

  return tester.assertions;
};

AssertionGenerator.prototype.openScadModule = function(testText) {
  var tester = new ModuleTester(this.__setUp, testText, this.__testRunner.current.test);
  tester.generateOutput(this.__config.properties.openScadDirectory);

  this.__setUp = null;

  return tester.assertions;
};

module.exports = AssertionGenerator;