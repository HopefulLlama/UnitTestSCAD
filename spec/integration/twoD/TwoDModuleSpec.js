const path = require('path');

const UnitTestSCAD = require('../../../src');
const FileUtils = require('../_utils/FileUtils');

const openSCADDirectory = path.join(__dirname, '_resources');

describe('TwoDModuleSpec', () => {
  afterEach(() => FileUtils.checkClean());

  describe('error', () => {
    it('should error on a bad .scad file', () => {
      expect(() => new UnitTestSCAD.TwoDModule({
        openSCADDirectory: path.join(__dirname, '..', '_resources'),
        use: ['garbage.scad'],
      })).toThrow();
    });
  });

  describe('success', () => {
    const expectedVertices = [
      [0, -0],
      [5, -0],
      [5, -4],
      [0, -4],
    ];

    describe('include', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.TwoDModule({
          openSCADDirectory,
          include: ['square.scad'],
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('use', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.TwoDModule({
          openSCADDirectory,
          use: ['square-module.scad'],
          testText: 'mySquare([5, 4]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('setUpText', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.TwoDModule({
          openSCADDirectory,
          setUpText: 'square([5, 4]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });

    describe('testText', () => {
      let testee;

      beforeEach(() => {
        testee = new UnitTestSCAD.TwoDModule({
          openSCADDirectory,
          testText: 'square([5, 4]);'
        });
      });

      it('should have the correct height', () => expect(testee.height).toBe(4));
      it('should have the correct width', () => expect(testee.width).toBe(5));
      it('should have the correct vertices', () => expect(testee.vertices).toEqual(expectedVertices));
    });
  });
});