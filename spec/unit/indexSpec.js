const index = require('../../src/index');

const OpenSCADFunction = require('../../src/api/OpenSCADFunction');
const ThreeDModule = require('../../src/api/ThreeDModule');
const TwoDModule = require('../../src/api/TwoDModule');
const Types = require('../../src/types/Types');

describe('indexSpec', () => {
  it('should have OpenSCADFunction', () => expect(index.Function).toBe(OpenSCADFunction));
  it('should have ThreeDModule', () => expect(index.ThreeDModule).toBe(ThreeDModule));
  it('should have TwoDModule', () => expect(index.TwoDModule).toBe(TwoDModule));
  it('should have Types', () => expect(index.Types).toBe(Types));
});