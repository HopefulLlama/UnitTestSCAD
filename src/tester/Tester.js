var os = require('os');

function Tester(testText, test, assertions) {
  this.testText = testText;
  this.test = test;

  this.output = '';

  assertions.tester = this;
  this.assertions = assertions;

  this.scadHandler = require('../util/ScadHandler');
}

Tester.START_MARKER = '"UnitTestSCAD __start_marker__"';
Tester.END_MARKER = '"UnitTestSCAD __end_marker__"';

Tester.wrapWithMarker = function(text) {
  return [
    'echo(' + Tester.START_MARKER + ');', 
    'echo(' + text + ');', 
    'echo(' + Tester.END_MARKER + ');'
  ].join(os.EOL);
};

Tester.failurePrevention = os.EOL + 'cube(1)';

module.exports = Tester;