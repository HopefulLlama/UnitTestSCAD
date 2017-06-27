var fs = require('fs');
var util = require('util');
var xml2js = require('xml2js');

var FileHandler = require('../util/FileHandler');
var Tester = require('./Tester');
var TwoDModuleAssertions = require('./TwoDModuleAssertions');

function TwoDModuleTester(setUpText, testText, test) {
  Tester.call(this, setUpText, testText, test, new TwoDModuleAssertions());
}
util.inherits(TwoDModuleTester, Tester);

TwoDModuleTester.prototype.generateOutput = function(openScadDirectory) {
  this.generateScadFile(openScadDirectory);
  this.output = FileHandler.getSvgContent();

  var result = '';
  xml2js.parseString(this.output, function(err, res) {
    if(err) {
      throw new Error();
    } else {
      result = res.svg;      
    }
  });
  this.parsedOutput = result;
};

module.exports = TwoDModuleTester;