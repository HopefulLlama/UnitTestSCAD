const File = require('./File');

const svgFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_TWO_D.svg';

module.exports = {
  execute(header, setUpText, testText) {
    return File.execute({
      header,
      setUpText,
      testText,
    }, svgFile).file;
  }
};