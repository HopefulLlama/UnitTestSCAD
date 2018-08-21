const Assertions = require('./Assertions');
const TypeConverter = require('../util/TypeConverter');

module.exports = class extends Assertions {
  constructor() {
    super();
  }

  outputToBe(expectedText) {
    return this.__testEquality(this.tester.output, expectedText);
  }

  typeToBe(expectedType) {
    return this.__testEquality(TypeConverter(this.tester.output), expectedType);
  }
};