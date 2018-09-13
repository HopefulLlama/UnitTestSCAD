const TypeConverter = require('../../../src/types/TypeConverter');
const Types = require('../../../src/types/Types');

const booleans = ['true', 'false'];
const inf = 'inf';
const nan = 'nan';
const numbers = ['1', '5', '10000', '1.34', '67.56'];
const ranges = [
  '[0:1]',
  '[120:342]',
  '[27809784:2348992]',
  '[0 : 1 : 10]'
];
const strings = [
  '"Hello"',
  '"World"',
  '"Foo"',
  '"Bar"'
];
const undef = 'undef';
const vectors = [
  '[0,1]',
  '[120,342]',
  '[27809784,2348992]'
];

const badValues = [
  'not',
  'a',
  'valid',
  'value'
];

describe('TypeConverterSpec', () => {
  describe('bad values', () => {
    badValues.forEach(badValue => {
      it(`getType should be undefined for ${badValue}`, () => {
        expect(TypeConverter.getType(badValue)).toBe(undefined);
      });
    });
  });

  describe('boolean', () => {
    booleans.forEach(bool => {
      it(`getType should be type 'boolean' for ${bool}`, () => {
        expect(TypeConverter.getType(bool)).toBe(Types.BOOLEAN);
      });
    });
  });

  describe('inf', () => {
    it('getType should be type \'inf\' for \'inf\'', () => {
      expect(TypeConverter.getType(inf)).toBe(Types.INF);
    });
  });

  describe('nan', () => {
    it('getType should be type \'nan\' for \'nan\'', () => {
      expect(TypeConverter.getType(nan)).toBe(Types.NAN);
    });
  });

  describe('number', () => {
    numbers.forEach(number => {
      it(`getType should be type 'number' for ${number}`, () => {
        expect(TypeConverter.getType(number)).toBe(Types.NUMBER);
      });
    });
  });

  describe('range', () => {
    ranges.forEach(range => {
      it(`getType should be type 'boolean' for ${range}`, () => {
        expect(TypeConverter.getType(range)).toBe(Types.RANGE);
      });
    });
  });

  describe('string', () => {
    strings.forEach(string => {
      it(`getType should be type 'boolean' for ${string}`, () => {
        expect(TypeConverter.getType(string)).toBe(Types.STRING);
      });
    });
  });

  describe('undef', () => {
    it('getType should be type \'undef\' for \'undef\'', () => {
      expect(TypeConverter.getType(undef)).toBe(Types.UNDEF);
    });
  });

  describe('vector', () => {
    vectors.forEach(vector => {
      it(`getType should be type 'vector' for ${vector}`, () => {
        expect(TypeConverter.getType(vector)).toBe(Types.VECTOR);
      });
    });
  });
});