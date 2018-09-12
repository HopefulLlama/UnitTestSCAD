const {EOL} = require('os');

const proxyquire = require('proxyquire');

const output = `vertex 0 0 0${EOL}vertex 5 5 5${EOL}vertex 7.5 10.75 12${EOL}endfacet${EOL}vertex 18.123 19 20${EOL}endfacet`;
const mockThreeDModuleFile = {
  execute: jasmine.createSpy('mockThreeDModuleFile.execute').and.returnValue(output)
};

const ThreeDModule = proxyquire('../../../src/api/ThreeDModule', {
  '../file/ThreeDModuleFile': mockThreeDModuleFile
});

describe('ThreeDModuleSpec', () => {
  let testee;
  beforeEach(() => {
    testee = new ThreeDModule();
  });

  it('should get the vertices', () => expect(testee.vertices).toEqual([
    [0, 0, 0],
    [5, 5, 5],
    [7.5, 10.75, 12],
    [18.123, 19, 20],
  ]));
  it('should have the correct width', () => expect(testee.width).toBe(18.123));
  it('should have the correct height', () => expect(testee.height).toBe(19));
  it('should have the correct depth', () => expect(testee.depth).toBe(20));
  it('should count \'endfacet\' as triangles', () => expect(testee.triangleCount).toBe(2));
});