const OpenScadType = require('../constants/OpenScadType');

function testBoolean(text) {
  return ['true', 'false'].indexOf(text) > -1;
}

function testInf(text) {
  return text === 'inf';
}

function testNan(text) {
  return text === 'nan';
}

function testNumber(text) {
  return !isNaN(parseFloat(text));
}

function testRange(text) {
  return text.match(/\[.+:.+\]/) !== null;
}

function testString(text) {
  return text[0] === '"' && text[text.length - 1] === '"';
}

function testUndef(text) {
  return text === 'undef';
}

function testVector(text) {
  return text.match(/\[.+,.+\]/) !== null;
}

const tests = {};
tests[OpenScadType.BOOLEAN] = testBoolean;
tests[OpenScadType.INF] = testInf;
tests[OpenScadType.NAN] = testNan;
tests[OpenScadType.NUMBER] = testNumber;
tests[OpenScadType.RANGE] = testRange;
tests[OpenScadType.STRING] = testString;
tests[OpenScadType.UNDEF] = testUndef;
tests[OpenScadType.VECTOR] = testVector;

module.exports = text => Object
  .keys(tests)
  .filter(property => tests[property](text))
  .pop();