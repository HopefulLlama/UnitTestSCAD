const fs = require('fs');

const FileHandler = require('../../../src/util/FileHandler');
const FunctionTester = require('../../../src/tester/FunctionTester');

describe('FunctionTester', () => {
  describe('generateOutput', () => {
    let TEST, tester;
    beforeEach(() => {
      TEST = {
        testSuite: {
          getHeader: () => ''
        }
      };
    });

    afterEach(() => {
      [FileHandler.scad, FileHandler.stl].forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    });

    it('should write a scad file and generate output', () => {
      tester = new FunctionTester(null, '"Hello"', TEST);

      expect(tester.output).toBe('');
      tester.generateOutput('');

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(tester.output).toBe('"Hello"');
    });
  });
});