const File = require('./File');

const stlFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_THREE_D.stl';

module.exports = {
  execute(header, setUpText, testText) {
    return File.execute({
      header,
      setUpText,
      testText,
    }, stlFile).file;
  }
};
