var fs = require('fs');
var os = require('os');

var FileHandler = require('../../../src/util/FileHandler');
var FunctionTester = require('../../../src/tester/FunctionTester');

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
      [FileHandler.scad, FileHandler.stl].forEach(function(file) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    });

    it('should write a scad file and generate output', function() {
      tester = new FunctionTester(null, '"Hello"', TEST);

      expect(tester.output).toBe('');
      tester.generateOutput('');

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(tester.output).toBe('"Hello"');
    });
  });
});