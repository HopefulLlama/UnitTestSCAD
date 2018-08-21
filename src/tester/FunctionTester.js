const os = require('os');

const FileHandler = require('../util/FileHandler');
const FunctionAssertions = require('./FunctionAssertions');
const Tester = require('./Tester');

function extractText(text) {
  const ECHO = 'ECHO: ';
  let content = text.split(os.EOL);

  return content
    .slice(
      content.indexOf(`${ECHO}${Tester.START_MARKER}`) + 1,
      content.indexOf(`${ECHO}${Tester.END_MARKER}`)
    )
    .map(line => line.slice(ECHO.length))
    .join(os.EOL);
}

module.exports = class extends Tester {
  constructor(setUpText, testText, test) {
    super(setUpText, Tester.wrapWithMarker(testText), test, new FunctionAssertions());
  }

  generateOutput(openScadDirectory) {
    this.generateScadFile(openScadDirectory);
    this.output = extractText(FileHandler.getStlConversionOutput());
  }
};