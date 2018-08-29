const os = require('os');

const FileHandler = require('../util/FileHandler');

function removeTrailingSemicolon(text) {
  if(text.charAt(text.length - 1) === ';') {
    text = text.substring(0, text.length - 1);
  }
  return text;
}

module.exports = class Tester {
  constructor(setUpText, testText, test, assertions) {
    this.setUpText = setUpText;
    this.testText = testText;
    this.test = test;

    this.output = '';

    assertions.tester = this;
    this.assertions = assertions;
  }

  static get START_MARKER() {
    return '"UnitTestSCAD __start_marker__"';
  }

  static get END_MARKER() {
    return '"UnitTestSCAD __end_marker__"';
  }

  static get FAILURE_PREVENTION() {
    return 'cube(1);';
  }

  static wrapWithMarker(text) {
    return [
      `echo(${Tester.START_MARKER});`,
      `echo(${removeTrailingSemicolon(text)});`,
      `echo(${Tester.END_MARKER});`,
      Tester.FAILURE_PREVENTION
    ].join(os.EOL);
  }

  generateScadFile(directory) {
    FileHandler.writeScadFile(this.test.testSuite.getHeader(directory), this.setUpText, this.testText);
  }
};