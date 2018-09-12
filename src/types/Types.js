/** @typedef {string} OpenSCADBoolean Represents an OpenSCAD boolean. Equal to 'boolean'. */
/** @typedef {string} OpenSCADInfinity Represents Infinity in OpenSCAD. Equal to 'inf'. */
/** @typedef {string} OpenSCADNaN Represents NaN (Not a Number) in OpenSCAD. Equal to 'nan'. */
/** @typedef {string} OpenSCADNumber Represents an OpenSCAD number. Equal to 'number'. */
/** @typedef {string} OpenSCADRange Represents an OpenSCAD range. Equal to 'range'. */
/** @typedef {string} OpenSCADString Represents an OpenSCAD string. Equal to 'string'. */
/** @typedef {string} OpenSCADUndefined Represents undef (undefined) in OpenSCAD. Equal to 'undefined'. */
/** @typedef {string} OpenSCADVector Represents an OpenSCAD vector. Equal to 'vector'. */

/**
 * @typedef {object} Types A collection of the available OpenSCAD types.
 * @property {OpenSCADBoolean} BOOLEAN See {@link OpenSCADBoolean}.
 * @property {OpenSCADInfinity} INF See {@link OpenSCADInfinity}.
 * @property {OpenSCADNaN} NAN See {@link OpenSCADNaN}.
 * @property {OpenSCADNumber} NUMBER See {@link OpenSCADNumber}.
 * @property {OpenSCADRange} RANGE See {@link OpenSCADRange}.
 * @property {OpenSCADString} STRING See {@link OpenSCADString}.
 * @property {OpenSCADUndefined} UNDEF See {@link OpenSCADUndefined}.
 * @property {OpenSCADVector} VECTOR See {@link OpenSCADVector}.
 */
module.exports = {
  BOOLEAN: 'boolean',
  INF: 'inf',
  NAN: 'nan',
  NUMBER: 'number',
  RANGE: 'range',
  STRING: 'string',
  UNDEF: 'undef',
  VECTOR: 'vector',
};