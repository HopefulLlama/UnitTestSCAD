const proxyquire = require('proxyquire');

const Types = require('../../../src/types/Types');

const output = 'output';
const types = [
  {
    type: Types.BOOLEAN,
    method: 'isBoolean'
  }, {
    type: Types.INF,
    method: 'isInf'
  }, {
    type: Types.NAN,
    method: 'isNan'
  }, {
    type: Types.NUMBER,
    method: 'isNumber'
  }, {
    type: Types.RANGE,
    method: 'isRange'
  }, {
    type: Types.STRING,
    method: 'isString'
  }, {
    type: Types.UNDEF,
    method: 'isUndef'
  }, {
    type: Types.VECTOR,
    method: 'isVector'
  }
];

const mockFunctionFile = {
  execute: jasmine.createSpy('mockFunctionFile.execute').and.returnValue(output)
};

const mockTypeConverter = {
  getType: jasmine.createSpy('mockTypeConverter.getType')
};

const OpenSCADFunction = proxyquire('../../../src/api/OpenSCADFunction', {
  '../file/FunctionFile': mockFunctionFile,
  '../types/TypeConverter': mockTypeConverter,
});

describe('OpenSCADFunctionSpec', () => {
  let testee;

  types.forEach(type => {
    describe(type.type, () => {
      beforeEach(() => {
        mockTypeConverter.getType.and.returnValue(type.type);
        testee = new OpenSCADFunction();
      });

      it('should get the type from TypeConverter', () => {
        expect(testee.type).toBe(type.type);
        expect(mockTypeConverter.getType).toHaveBeenCalledWith(output);
      });


      it(`${type.method} should be true`, () =>

        expect(testee[type.method]()).toBe(true, type.method));

      types
        .filter(notType => notType !== type)
        .forEach(notType => {
          it(`${notType.method} should be false`, () =>

            expect(testee[notType.method]()).toBe(false, notType.method));
        });
    });
  });
});