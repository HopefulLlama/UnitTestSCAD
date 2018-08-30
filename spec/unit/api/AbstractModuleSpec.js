const proxyquire = require('proxyquire');

const mockAbstractParent = class {};

const AbstractModule = proxyquire('../../../src/api/AbstractModule', {
  './AbstractParent': mockAbstractParent
});

function generateAbstractModule(vertices) {
  const abstractModule = new AbstractModule();
  abstractModule.vertices = vertices;
  return abstractModule;
}

describe('AbstractModuleSpec', () => {
  describe('2d', () => {
    it('should be within bounds when equal', () => {
      const testee = generateAbstractModule([
        [-1, -1],
        [1, 1]
      ]);

      const box = [
        [-1, -1],
        [1, 1]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(true, box);
    });

    it('should be within bounds when all are within', () => {
      const testee = generateAbstractModule([
        [-1, -1],
        [1, 1]
      ]);

      const box = [
        [-2, -2],
        [2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(true, box);
    });

    it('should not be within bounds when \'x\' is smaller than minimum', () => {
      const testee = generateAbstractModule([
        [-5, -1],
        [1, 1]
      ]);

      const box = [
        [-2, -2],
        [2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'x\' is greater than maximum', () => {
      const testee = generateAbstractModule([
        [-1, -1],
        [5, 1]
      ]);

      const box = [
        [-2, -2],
        [2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'y\' is smaller than minimum', () => {
      const testee = generateAbstractModule([
        [-1, -5],
        [1, 1]
      ]);

      const box = [
        [-2, -2],
        [2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'y\' is greater than maximum', () => {
      const testee = generateAbstractModule([
        [-1, -1],
        [1, 5]
      ]);

      const box = [
        [-2, -2],
        [2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });
  });
  describe('3d', () => {
    it('should be within bounds when equal', () => {
      const testee = generateAbstractModule([
        [-1, -1, -1],
        [1, 1, 1]
      ]);

      const box = [
        [-1, -1, -1],
        [1, 1, 1]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(true, box);
    });

    it('should be within bounds when all are within', () => {
      const testee = generateAbstractModule([
        [-1, -1, -1],
        [1, 1, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(true, box);
    });

    it('should not be within bounds when \'x\' is smaller than minimum', () => {
      const testee = generateAbstractModule([
        [-5, -1, -1],
        [1, 1, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'x\' is greater than maximum', () => {
      const testee = generateAbstractModule([
        [-1, -1, -1],
        [5, 1, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'y\' is smaller than minimum', () => {
      const testee = generateAbstractModule([
        [-1, -5, -1],
        [1, 1, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'y\' is greater than maximum', () => {
      const testee = generateAbstractModule([
        [-1, -1, -1],
        [1, 5, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'z\' is smaller than minimum', () => {
      const testee = generateAbstractModule([
        [-1, -1, -5],
        [1, 1, 1]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });

    it('should not be within bounds when \'z\' is greater than maximum', () => {
      const testee = generateAbstractModule([
        [-1, -1, -1],
        [1, 1, 5]
      ]);

      const box = [
        [-2, -2, -2],
        [2, 2, 2]
      ];
      expect(testee.isWithinBoundingBox(box)).toBe(false, box);
    });
  });
});