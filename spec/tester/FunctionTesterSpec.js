var fs = require('fs');
var os = require('os');

var FunctionTester = require('../../src/tester/FunctionTester');

describe('FunctionTester', function() {
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
      if (fs.existsSync(tester.FileHandler.scad)) {
        fs.unlink(tester.FileHandler.scad);
      }
      if (fs.existsSync(tester.FileHandler.stl)) {
        fs.unlink(tester.FileHandler.stl);
      }
    });

    it('should write a scad file and generate output', function() {
      tester = new FunctionTester(null, '"Hello"', TEST);

      expect(tester.output).toBe('');
      tester.generateOutput('');

      expect(fs.existsSync(tester.FileHandler.scad)).toBe(true);
      expect(tester.output).toBe(['ECHO: "UnitTestSCAD __start_marker__"', 'ECHO: "Hello"', 'ECHO: "UnitTestSCAD __end_marker__"'].join(os.EOL) + os.EOL);
    });
  });
});