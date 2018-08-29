const fs = require('fs');

const FileHandler = require('../../../src/util/FileHandler');
const ModuleTester = require('../../../src/tester/ModuleTester');

describe('ModuleTester', () => {
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

    it('should store the output of the generated STL', () => {
      const PATH = 'spec/unit/resources/shouldstoretheoutputofthegeneratedSTL';
      tester = new ModuleTester(null, 'cube([5, 5, 5]);', TEST);
      FileHandler.scad = PATH + '.scad';
      FileHandler.stl = PATH + '.stl';
      tester.generateOutput('');

      const expectedOutput = fs.readFileSync(FileHandler.stl, 'utf8');

      expect(tester.output).toBe(expectedOutput);
    });
  });
});