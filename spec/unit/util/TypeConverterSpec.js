var OpenScadType = require('../../../src/constants/OpenScadType');
var TypeConverter = require('../../../src/util/TypeConverter');

describe('TypeConverter', function() {
  var TESTS = {
    '1': OpenScadType.NUMBER,
    '1.5': OpenScadType.NUMBER,
    '3.14159': OpenScadType.NUMBER,
    'inf': OpenScadType.INF,
    'nan': OpenScadType.NAN,
    'undef': OpenScadType.UNDEF,
    'true': OpenScadType.BOOLEAN,
    'false': OpenScadType.BOOLEAN,
    '"Text"': OpenScadType.STRING,
    '"String"': OpenScadType.STRING,
    '[0 : 1 : 10]': OpenScadType.RANGE,
    '[0 : 2 : 40]': OpenScadType.RANGE,
    '[0, 1, 2, 3]': OpenScadType.VECTOR,
    '[[0, 1], [1, 2], [2, 3]]': OpenScadType.VECTOR,
    'dsfdsfs': undefined
  };

  for(var property in TESTS) {
  	/* jshint loopfunc: true */
    it('should convert ' + property + ' to ' + TESTS[property], function() {
      expect(TypeConverter(property)).toBe(TESTS[property]);
    });
  }
});