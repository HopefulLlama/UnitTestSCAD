var fs = require('fs');
var util = require('util');

var ModuleAssertions = require('./ModuleAssertions');
var ScadHandler = require('../util/ScadHandler');
var Tester = require('./Tester');

function ModuleTester(testText, test) {
	Tester.call(this, testText, test, new ModuleAssertions());
}

ModuleTester.prototype.generateOutput = function(openScadDirectory, scadFile, stlFile) {
  ScadHandler.writeScadFile(openScadDirectory, scadFile, this.testText + ';', this);
  ScadHandler.execTemp(stlFile, scadFile);
  this.output = fs.readFileSync(stlFile, 'utf8');
};

module.exports = ModuleTester;