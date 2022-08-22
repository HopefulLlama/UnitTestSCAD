const {getHeader} = require('../file/Header');

function valueOrDefault(object, property, defaultValue) {
  return (object !== undefined && object[property] !== undefined) ? object[property] : defaultValue;
}

function sanitise(options) {
  return {
    openSCADDirectory: valueOrDefault(options, 'openSCADDirectory', ''),
    use: valueOrDefault(options, 'use', []),
    include: valueOrDefault(options, 'include', []),
    setUpText: valueOrDefault(options, 'setUpText', ''),
    testText: valueOrDefault(options, 'testText', ''),
    setVariables: valueOrDefault(options, 'setVariables', [])
  };
}

/**
 * @typedef {object} Options Key/value pair of options to configure the execution of an OpenSCAD test.
 * @property {String} openSCADDirectory The prefix to prepend to all uses/includes.
 * @property {String[]} use List of .scad files to import as 'use'.
 * @property {String[]} include List of .scad files to import as 'include'.
 * @property {String} setUpText Any required OpenSCAD code to set up the test.
 * @property {String} testText The OpenSCAD code to be tested and asserted on.
 * @property {String[]} setVariables Variables to set in openscad.
 */

/**
 * @typedef {number[]} Vertex A 2/3 length co-ordinate representing a point in 2D/3D space.
 */

module.exports = class {
  constructor(dirtyOptions, fileType) {
    const options = sanitise(dirtyOptions);
    const header = getHeader(options.openSCADDirectory, options.use, options.include);
    this.output = fileType.execute(header, options.setUpText, options.testText, options.setVariables);
  }
};
