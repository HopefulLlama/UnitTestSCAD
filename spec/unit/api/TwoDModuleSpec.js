const path = require('path');
const fs = require('fs');

const proxyquire = require('proxyquire');

const output = fs.readFileSync(path.join(__dirname, '..', '_resources', 'function-output.svg'), 'utf-8');
const mockTwoDModuleFile = jasmine.createSpyObj('mockTwoDModuleFile', ['execute']);

const TwoDModule = proxyquire('../../../src/api/TwoDModule', {
  '../file/TwoDModuleFile': mockTwoDModuleFile
});

describe('TwoDModuleSpec', () => {
  describe('successful XML parse', () => {
    let testee;

    beforeEach(() => {
      mockTwoDModuleFile.execute.and.returnValue(output);
      testee = new TwoDModule();
    });

    it('should extract the height', () => expect(testee.height).toBe(6));
    it('should extract the width', () => expect(testee.width).toBe(6));
    it('should extract the vertices', () => expect(testee.vertices).toEqual([
      [6, -6],
      [5, -6],
      [5, -5],
      [6, -5],
      [1, -1],
      [0, -1],
      [0, -0],
      [1, -0],
    ]));
  });

  describe('error thrown on XML parse', () => {
    const error = 'error';

    beforeEach(() => mockTwoDModuleFile.execute.and.throwError(error));

    it('should throw an error when it tries to instantiate the module', () => {
      expect(() => new TwoDModule()).toThrowError(error);
    });
  });
});