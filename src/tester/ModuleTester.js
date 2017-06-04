var fs = require('fs');
var util = require('util');

var ModuleAssertions = require('./ModuleAssertions');
var Tester = require('./Tester');

function ModuleTester(setUpText, testText, test) {
  Tester.call(this, setUpText, testText, test, new ModuleAssertions());
}
util.inherits(ModuleTester, Tester);

ModuleTester.prototype.generateOutput = function(openScadDirectory) {
  this.FileHandler.writeScadFile(this.test.testSuite.getHeader(openScadDirectory), this.setUpText, this.testText);
  this.FileHandler.executeConversion();
  this.output = fs.readFileSync(this.FileHandler.stl, 'utf8');
};

module.exports = ModuleTester;