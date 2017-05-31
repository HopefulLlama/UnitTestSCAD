var fs = require('fs');

var FunctionTester = require('../../src/tester/FunctionTester');

describe('FunctionTester', function() {
  describe('generateOutput', function() {
    var TEST;
    beforeEach(function() {
      TEST = {
        'testSuite': {
          'getHeader': function() {
            return '';
          }
        }
      };
    });

    it('should write a scad file and generate output', function() {
      var tester = new FunctionTester('"Hello"', TEST);

      expect(tester.output).toBe('');
      tester.generateOutput('');

      expect(tester.output.search(/UnitTestSCAD __start_marker__/) > 0).toBe(true);
      expect(tester.output.search(/Hello/) > 0).toBe(true);
      expect(tester.output.search(/UnitTestSCAD __end_marker__/) > 0).toBe(true);

      if (fs.existsSync(tester.scadHandler.scad)) {
        fs.unlink(tester.scadHandler.scad);
      }
      if (fs.existsSync(tester.scadHandler.stl)) {
        fs.unlink(tester.scadHandler.stl);
      }
    });
  });
});