var fs = require('fs');

var ScadHandler = require('../util/ScadHandler');

function Tester(testText, test, assertions) {
  this.testText = testText;
  this.test = test;

  this.consoleOutput = '';
  this.fileOutput = '';

  assertions.tester = this;
  this.assertions = assertions;
};

Tester.prototype.generateStlFile = function(openScadDirectory, scadFile, stlFile) {
  ScadHandler.writeScadFile(openScadDirectory, scadFile, this.testText + ';', this);
  this.consoleOutput = ScadHandler.execTemp(stlFile, scadFile);

  this.fileOutput = fs.readFileSync(stlFile, 'utf8');
};

module.exports = Tester;