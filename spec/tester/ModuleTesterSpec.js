var fs = require('fs');

var ModuleTester = require('../../src/tester/ModuleTester');

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
      if(fs.existsSync(tester.scadHandler.scad)) {
        fs.unlink(tester.scadHandler.scad);
      }

      if(fs.existsSync(tester.scadHandler.stl)) {
        fs.unlink(tester.scadHandler.stl);
      }
    });

    it('should store the output of the generated STL', function() {
      var PATH = 'spec/resources/shouldstoretheoutputofthegeneratedSTL';
      tester = new ModuleTester(null, 'cube([5, 5, 5]);', TEST);
      tester.scadHandler.scad = PATH + '.scad';
      tester.scadHandler.stl = PATH + '.stl';
      tester.generateOutput('');

      var expectedOutput = fs.readFileSync(tester.scadHandler.stl, 'utf8');

      expect(tester.output).toBe(expectedOutput);
    });
  });
});