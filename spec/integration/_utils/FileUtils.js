const fs = require('fs');

const tempFiles = [
  'UnitTestSCAD_48967_TEMP_DELETE-ME_SCAD.scad',
  'UnitTestSCAD_48967_TEMP_DELETE-ME_FUNCTION.stl',
  'UnitTestSCAD_48967_TEMP_DELETE-ME_THREE_D.stl',
  'UnitTestSCAD_48967_TEMP_DELETE-ME_TWO_D.svg',
];

module.exports = {
  checkClean() {
    tempFiles.forEach(tempFile => expect(fs.existsSync(tempFile)).toBe(false, tempFile));
  }
};