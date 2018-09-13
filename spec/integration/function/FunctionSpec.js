const path = require('path');

const UnitTestSCAD = require('../../../src');
const FileUtils = require('../_utils/FileUtils');

const openSCADDirectory = path.join(__dirname, '_resources');

const boolean = {
  file: 'boolean.scad',
  method: 'isBoolean',
  type: UnitTestSCAD.Types.BOOLEAN,
};
const inf = {
  file: 'inf.scad',
  method: 'isInf',
  type: UnitTestSCAD.Types.INF,
};
const nan = {
  file: 'nan.scad',
  method: 'isNan',
  type: UnitTestSCAD.Types.NAN,
};
const number = {
  file: 'number.scad',
  method: 'isNumber',
  type: UnitTestSCAD.Types.NUMBER,
};
const range = {
  file: 'range.scad',
  method: 'isRange',
  type: UnitTestSCAD.Types.RANGE,
};
const string = {
  file: 'string.scad',
  method: 'isString',
  type: UnitTestSCAD.Types.STRING,
};
const undef = {
  file: 'undef.scad',
  method: 'isUndef',
  type: UnitTestSCAD.Types.UNDEF,
};
const vector = {
  file: 'vector.scad',
  method: 'isVector',
  type: UnitTestSCAD.Types.VECTOR,
};
const types = [boolean, inf, nan, number, range, string, undef, vector];

describe('FunctionSpec', () => {

  afterEach(() => FileUtils.checkClean());

  types.forEach(type => {
    describe(type.type, () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.Function({
          openSCADDirectory,
          use: [type.file],
          testText: 'test();'
        });
      });

      it('should be the correct type', () => expect(testee.type).toBe(type.type));
      it(`${type.method} should be true`, () => expect(testee[type.method]()).toBe(true, type.method));

      types
        .filter(notType => notType !== type)
        .forEach(notType => {
          it(`${notType.method} should be false`, () => expect(testee[notType.method]()).toBe(false, notType.method));
        });
    });
  });
});