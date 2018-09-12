const AbstractParent = require('./AbstractParent');
const FunctionFile = require('../file/FunctionFile');
const TypeConverter = require('../types/TypeConverter');
const Types = require('../types/Types');

/** @class */
class Function extends AbstractParent {
  /**
   * @param {Options} options
   */
  constructor(options) {
    super(options, FunctionFile);
    /**
     * @memberof Function
     * @instance
     * @member {string} output The extracted output from execution of the .scad file.
     */
    /**
     * @memberof Function
     * @instance
     * @member {Type} type The detected type of the value retrieved from the OpenSCAD function.
     */
    this.type = TypeConverter.getType(this.output);
  }

  /**
   * Returns true if this type is of type {@link OpenSCADBoolean}.
   * @returns {boolean} True if this type is of type {@link OpenSCADBoolean}.
   */
  isBoolean() {
    return this.type === Types.BOOLEAN;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADInfinity}.
   * @returns {boolean} True if this type is of type {@link OpenSCADInfinity}.
   */
  isInf() {
    return this.type === Types.INF;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADNaN}.
   * @returns {boolean} True if this type is of type {@link OpenSCADNaN}.
   */
  isNan() {
    return this.type === Types.NAN;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADNumber}.
   * @returns {boolean} True if this type is of type {@link OpenSCADNumber}.
   */
  isNumber() {
    return this.type === Types.NUMBER;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADRange}.
   * @returns {boolean} True if this type is of type {@link OpenSCADBoolean}.
   */
  isRange() {
    return this.type === Types.RANGE;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADString}.
   * @returns {boolean} True if this type is of type {@link OpenSCADString}.
   */
  isString() {
    return this.type === Types.STRING;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADUndefined}.
   * @returns {boolean} True if this type is of type {@link OpenSCADUndefined}.
   */
  isUndef() {
    return this.type === Types.UNDEF;
  }

  /**
   * Returns true if this type is of type {@link OpenSCADVector}.
   * @returns {boolean} True if this type is of type {@link OpenSCADVector}.
   */
  isVector() {
    return this.type === Types.VECTOR;
  }
}

module.exports = Function;