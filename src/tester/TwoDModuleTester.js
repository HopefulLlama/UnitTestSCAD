var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');

var TwoDModuleAssertions = require('./TwoDModuleAssertions');
var Tester = require('./Tester');

function TwoDModuleTester(setUpText, testText, test) {
  Tester.call(this, setUpText, testText, test, new TwoDModuleAssertions());
}
util.inherits(TwoDModuleTester, Tester);

TwoDModuleTester.prototype.generateOutput = function(openScadDirectory) {
  this.generateScadFile(openScadDirectory);
  this.FileHandler.convertToSvg();
  this.output = fs.readFileSync(this.FileHandler.svg, 'utf8');

  var result = '';
  xml2js.parseString(this.output, function(err, res) {
    result = res.svg;
  });
  this.parsedOutput = result;
};

module.exports = TwoDModuleTester;