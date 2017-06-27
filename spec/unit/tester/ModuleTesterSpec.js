var fs = require('fs');

var FileHandler = require('../../../src/util/FileHandler');
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
      [FileHandler.scad, FileHandler.stl].forEach(function(file) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    });

    it('should store the output of the generated STL', function() {
      var PATH = 'spec/unit/resources/shouldstoretheoutputofthegeneratedSTL';
      tester = new ModuleTester(null, 'cube([5, 5, 5]);', TEST);
      FileHandler.scad = PATH + '.scad';
      FileHandler.stl = PATH + '.stl';
      tester.generateOutput('');

      var expectedOutput = fs.readFileSync(FileHandler.stl, 'utf8');

      expect(tester.output).toBe(expectedOutput);
    });
  });
});