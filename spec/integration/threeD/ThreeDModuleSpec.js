const path = require('path');

const UnitTestSCAD = require('../../../src');
const FileUtils = require('../_utils/FileUtils');

const openSCADDirectory = path.join(__dirname, '_resources');

describe('ThreeDModuleSpec', () => {
  afterEach(() => FileUtils.checkClean());

  describe('error', () => {
    it('should error on a bad .scad file', () => {
      expect(() => new UnitTestSCAD.ThreeDModule({
        openSCADDirectory: path.join(__dirname, '..', '_resources'),
        use: ['garbage.scad'],
      })).toThrow();
    });
  });

  describe('success', () => {
    const expectedVertices = [
      [0, 4, 6],
      [5, 0, 6],
      [5, 4, 6],
      [0, 0, 6],
      [0, 0, 0],
      [5, 4, 0],
      [5, 0, 0],
      [0, 4, 0],
    ];
    describe('include', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.ThreeDModule({
          openSCADDirectory,
          include: ['cube.scad'],
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct depth', () => expect(testee.depth).toBe(6));
      it('should have the correct triangleCount', () => expect(testee.triangleCount).toBe(12));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('use', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.ThreeDModule({
          openSCADDirectory,
          use: ['cube-module.scad'],
          testText: 'myCube([5, 4, 6]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct depth', () => expect(testee.depth).toBe(6));
      it('should have the correct triangleCount', () => expect(testee.triangleCount).toBe(12));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('setUpText', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.ThreeDModule({
          openSCADDirectory,
          setUpText: 'cube([5, 4, 6]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct depth', () => expect(testee.depth).toBe(6));
      it('should have the correct triangleCount', () => expect(testee.triangleCount).toBe(12));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('testText', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.ThreeDModule({
          openSCADDirectory,
          testText: 'cube([5, 4, 6]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct depth', () => expect(testee.depth).toBe(6));
      it('should have the correct triangleCount', () => expect(testee.triangleCount).toBe(12));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });
  });
});