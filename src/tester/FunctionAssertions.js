var fs = require('fs');
var os = require('os');
var util = require('util');

var Assertions = require('./Assertions');
var FileHandler = require('../util/FileHandler');
var Tester = require('./Tester');

function FunctionAssertions() {
  Assertions.apply(this);
}

util.inherits(FunctionAssertions, Assertions);

FunctionAssertions.prototype.outputToBe = function(expectedText) {
  var ECHO = 'ECHO: ';

  var content = this.tester.output.split(os.EOL);
  content = content.slice(
    content.indexOf(ECHO + Tester.START_MARKER) + 1,
    content.indexOf(ECHO + Tester.END_MARKER)
  )
  .map(function(line) {
    return line.slice(ECHO.length);
  })
  .join(os.EOL);
  
  return this.__testEquality(content, expectedText);
};

module.exports = FunctionAssertions;