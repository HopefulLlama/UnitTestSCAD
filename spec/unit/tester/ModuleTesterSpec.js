var fs = require('fs');

var ModuleTester = require('../../../src/tester/ModuleTester');

describe('ModuleTester', function() {
  describe('generateOutput', function() {
    var TEST, tester;
    beforeEach(function() {
      TEST = {
        'testSuite': {
          'getHeader': function() {
            return '';
          }
        }
      };
    });

    afterEach(function() {
      if(fs.existsSync(tester.FileHandler.scad)) {
        fs.unlink(tester.FileHandler.scad);
      }

      if(fs.existsSync(tester.FileHandler.stl)) {
        fs.unlink(tester.FileHandler.stl);
      }
    });

    it('should store the output of the generated STL', function() {
      var PATH = 'spec/unit/resources/shouldstoretheoutputofthegeneratedSTL';
      tester = new ModuleTester(null, 'cube([5, 5, 5]);', TEST);
      tester.FileHandler.scad = PATH + '.scad';
      tester.FileHandler.stl = PATH + '.stl';
      tester.generateOutput('');

      var expectedOutput = fs.readFileSync(tester.FileHandler.stl, 'utf8');

      expect(tester.output).toBe(expectedOutput);
    });
  });
});