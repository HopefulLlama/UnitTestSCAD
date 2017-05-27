var fs = require('fs');

var ModuleAssertions = require('./ModuleAssertions');
var Tester = require('./Tester');

function ModuleTester(testText, test) {
	Tester.call(this, testText, test, new ModuleAssertions());
}

ModuleTester.prototype.generateOutput = function(openScadDirectory) {
  this.scadHandler.writeScadFile(this.test.testSuite.getHeader(openScadDirectory), this.testText + ';');
  this.scadHandler.executeConversion();
  this.output = fs.readFileSync(this.scadHandler.stl, 'utf8');
};

module.exports = ModuleTester;