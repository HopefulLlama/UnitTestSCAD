const OpenScadType = require('./Types');

function isBoolean(text) {
  return ['true', 'false'].includes(text);
}

function isInf(text) {
  return text === 'inf';
}

function isNan(text) {
  return text === 'nan';
}

function isNumber(text) {
  return !isNaN(parseFloat(text));
}

function isRange(text) {
  return text.match(/\[.+(:.+){1,2}\]/) !== null;
}

function isString(text) {
  return text.startsWith('"') && text.endsWith('"');
}

function isUndef(text) {
  return text === 'undef';
}

function isVector(text) {
  return text.match(/\[.+,.+\]/) !== null;
}

const tests = {};
tests[OpenScadType.BOOLEAN] = isBoolean;
tests[OpenScadType.INF] = isInf;
tests[OpenScadType.NAN] = isNan;
tests[OpenScadType.NUMBER] = isNumber;
tests[OpenScadType.RANGE] = isRange;
tests[OpenScadType.STRING] = isString;
tests[OpenScadType.UNDEF] = isUndef;
tests[OpenScadType.VECTOR] = isVector;

module.exports = {
  getType(text) {
    return Object
      .keys(tests)
      .filter(property => tests[property](text))
      .pop();
  }
};