const OpenSCADFunction = require('./api/OpenSCADFunction');
const ThreeDModule = require('./api/ThreeDModule');
const TwoDModule = require('./api/TwoDModule');
const Types = require('./types/Types');

/**
 * @typedef {object} UnitTestSCAD This is the top level object exposed when requiring UnitTestSCAD into a NodeJS script.
 * @property {Function} Function Exposes the {@link Function} class for use. This should be used when testing an OpenSCAD function.
 * @property {ThreeDModule} ThreeDModule Exposes the {@link ThreeDModule} class for use. This should be used when testing an OpenSCAD module which produces a 3D model.
 * @property {TwoDModule} TwoDModule Exposes the {@link TwoDModule} class for use. This should be used when testing an OpenSCAD module which produces a 2D model.
 * @property {Types} Types Exposes the {@link Types} object for use. This should be used when performing assertions on a {@link Function}.
 */
module.exports = {
  Function: OpenSCADFunction,
  ThreeDModule,
  TwoDModule,
  Types
};