const {EOL} = require('os');

const File = require('./File');

const stlFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_FUNCTION.stl';

const startMarker = '"UnitTestSCAD __start_marker__"';
const endMarker = '"UnitTestSCAD __end_marker__"';
const failurePrevention = 'cube(1);';

function removeTrailingSemicolon(text) {
  if(text.endsWith(';')) {
    return text.slice(0, -1);
  } else {
    return text;
  }
}

function wrapWithMarkers(text) {
  return [
    `echo(${startMarker});`,
    `echo(${removeTrailingSemicolon(text)});`,
    `echo(${endMarker});`,
    failurePrevention
  ].join(EOL);
}

function extractText(text) {
  const ECHO = 'ECHO: ';
  const content = text.split(EOL);

  return content
    .slice(
      content.indexOf(`${ECHO}${startMarker}`) + 1,
      content.indexOf(`${ECHO}${endMarker}`)
    )
    .map(line => line.slice(ECHO.length))
    .join(EOL);
}

module.exports = {
  execute(header, setUpText, testText) {
    return extractText(File.execute({
      header,
      setUpText,
      testText: wrapWithMarkers(testText),
    }, stlFile).out);
  }
};