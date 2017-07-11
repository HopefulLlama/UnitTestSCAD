var OpenScadType = require('../constants/OpenScadType');

var testBoolean = function(text) {
  return ['true', 'false'].indexOf(text) > -1;
};

var testInf = function(text) {
  return text === 'inf';
};

var testNan = function(text) {
  return text === 'nan';
};

var testNumber = function(text) {
  return !isNaN(parseFloat(text));
};

var testRange = function(text) {
  return text.match(/\[.+:.+\]/) !== null;
};

var testString = function(text) {
  return text[0] === '"' && text[text.length - 1] === '"';
};

var testUndef = function(text) {
  return text === 'undef';
};

var testVector = function(text) {
  return text.match(/\[.+,.+\]/) !== null;
};

var tests = {};
tests[OpenScadType.BOOLEAN] = testBoolean;
tests[OpenScadType.INF] = testInf;
tests[OpenScadType.NAN] = testNan;
tests[OpenScadType.NUMBER] = testNumber;
tests[OpenScadType.RANGE] = testRange;
tests[OpenScadType.STRING] = testString;
tests[OpenScadType.UNDEF] = testUndef;
tests[OpenScadType.VECTOR] = testVector;

module.exports = function(text) {
  for(var property in tests) {
    if(tests[property](text)) {
      return property;
    }
  }
  return undefined;
};