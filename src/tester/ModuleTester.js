var fs = require('fs');
var util = require('util');

var FileHandler = require('../util/FileHandler');
var ModuleAssertions = require('./ModuleAssertions');
var Tester = require('./Tester');

function ModuleTester(setUpText, testText, test) {
  Tester.call(this, setUpText, testText, test, new ModuleAssertions());
}
util.inherits(ModuleTester, Tester);

ModuleTester.prototype.generateOutput = function(openScadDirectory) {
  this.generateScadFile(openScadDirectory);
  this.output = FileHandler.getStlContent();
};

module.exports = ModuleTester;