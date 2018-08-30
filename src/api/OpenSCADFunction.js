const AbstractParent = require('./AbstractParent');
const FunctionFile = require('../file/FunctionFile');
const TypeConverter = require('../types/TypeConverter');
const Types = require('../types/Types');

module.exports = class extends AbstractParent {
  constructor(options) {
    super(options, FunctionFile);
    this.type = TypeConverter.getType(this.output);
  }

  isBoolean() {
    return this.type === Types.BOOLEAN;
  }

  isInf() {
    return this.type === Types.INF;
  }

  isNan() {
    return this.type === Types.NAN;
  }

  isNumber() {
    return this.type === Types.NUMBER;
  }

  isRange() {
    return this.type === Types.RANGE;
  }

  isString() {
    return this.type === Types.STRING;
  }

  isUndef() {
    return this.type === Types.UNDEF;
  }

  isVector() {
    return this.type === Types.VECTOR;
  }
};
