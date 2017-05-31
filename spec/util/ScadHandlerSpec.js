var fs = require('fs');
var os = require('os');

var ScadHandler = require('../../src/util/ScadHandler');

describe('ScadHandler', function() {
  describe('writeScadFile', function() {
    it('should write a .scad file', function() {
      ScadHandler.scad = './spec/resources/itshouldwriteascadfile.scad';

      var HEADER = 'use <"Fake.scad">';
      var BODY = 'cube([1, 1, 1]);';
      ScadHandler.writeScadFile(HEADER, BODY);
      
      expect(fs.existsSync(ScadHandler.scad)).toBe(true);
      expect(fs.readFileSync(ScadHandler.scad, 'utf8')).toBe(HEADER + os.EOL + BODY);

      if (fs.existsSync(ScadHandler.scad)) {
        fs.unlink(ScadHandler.scad);
      }
      if (fs.existsSync(ScadHandler.stl)) {
        fs.unlink(ScadHandler.stl);
      }
    });
  });

  describe('executeConversion', function() {
    it('should capture the output of the scad -> stl command', function() {
      ScadHandler.scad = './spec/resources/echo.scad';
      ScadHandler.stl = './spec/resources/echo.stl';

      var output = ScadHandler.executeConversion();
      expect(output.search(/If you can see this then it worked/) >= 0).toBe(true, 'Expected ' + output + ' to contain If you can see this then it worked');

      if (fs.existsSync(ScadHandler.stl)) {
        fs.unlink(ScadHandler.stl);
      }
    });
  });

  describe('cleanUp', function() {
    function createTempFile(path) {
      fs.closeSync(fs.openSync(path, 'w'));
    }

    it('should delete the files associated', function() {
      ScadHandler.scad = './spec/resources/delet-this.scad';
      ScadHandler.stl = './spec/resources/delet-this.stl';

      createTempFile(ScadHandler.scad);
      createTempFile(ScadHandler.stl);

      ScadHandler.cleanUp();

      expect(fs.existsSync(ScadHandler.scad)).toBe(false, 'scad file');
      expect(fs.existsSync(ScadHandler.stl)).toBe(false, 'stl file');
    });
  });

  describe('getOutputLine', function() {
    it('should get the line after \'UnitTestSCAD\'', function() {
      expect(ScadHandler.getOutputLine([
        'Hi',
        'UnitTestSCAD',
        'Generic'
      ])).toBe('Generic');

      expect(ScadHandler.getOutputLine([
        'UnitTestSCAD',
        'Different',
        'Unique'
      ])).toBe('Different');

      expect(ScadHandler.getOutputLine([
        'Alex',
        'Comma',
        'UnitTestSCAD',
        'Safety'
      ])).toBe('Safety');
    });
  });

  describe('getVertices', function() {
    it('should return the vertices found in the form of \'vertex <int> <int> <int>\'', function() {
      expect(ScadHandler.getVertices(
        'hemlock' + os.EOL + 
        'clever' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'swag' + os.EOL + 
        'vertex 10 0 5'
      )).toEqual([[5, 4, 3], [10, 0, 5]]);
    });

    it('should uniquify the vertices in a given list', function() {
      expect(ScadHandler.getVertices(
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'vertex 5 4 3'
      )).toEqual([[5, 4, 3]]);
    });
  });

  describe('getTriangles', function() {
    it('should return the count of \'endfacet\' as a triangle count', function() {
      expect(ScadHandler.countTriangles(
        'cortex' + os.EOL + 
        'corrosive' + os.EOL + 
        'endfacet' + os.EOL + 
        'endfacet' + os.EOL + 
        'battalion' + os.EOL + 
        'endfacet'
      )).toEqual(3);
    });
  });
});