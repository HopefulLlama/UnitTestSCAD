const File = require('./File');

const stlFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_THREE_D.stl';

module.exports = {
  execute(header, setUpText, testText, setVariables) {
    return File.execute({
      header,
      setUpText,
      testText,
      setVariables,
    }, stlFile).file;
  }
};
