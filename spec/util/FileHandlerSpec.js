var fs = require('fs');
var os = require('os');

var FileHandler = require('../../src/util/FileHandler');

describe('FileHandler', function() {
  describe('writeScadFile', function() {
    var HEADER = 'use <"Fake.scad">';
    var BODY = 'cube([1, 1, 1]);';

    beforeEach(function() {
      FileHandler.scad = './spec/resources/itshouldwriteascadfile.scad';
    });

    afterEach(function() {
      if (fs.existsSync(FileHandler.scad)) {
        fs.unlink(FileHandler.scad);
      }
      if (fs.existsSync(FileHandler.stl)) {
        fs.unlink(FileHandler.stl);
      }
    });

    it('should write a .scad file=', function() {
      FileHandler.writeScadFile(HEADER, 'swag', BODY);
      
      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.readFileSync(FileHandler.scad, 'utf8')).toBe(HEADER + os.EOL + 'swag' + os.EOL + BODY);
    });

    it('should write a .scad file, ignoring set up', function() {
      FileHandler.writeScadFile(HEADER, null, BODY);
      
      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.readFileSync(FileHandler.scad, 'utf8')).toBe(HEADER + os.EOL + BODY);
    });
  });

  describe('executeConversion', function() {
    it('should capture the output of the scad -> stl command', function() {
      FileHandler.scad = './spec/resources/echo.scad';
      FileHandler.stl = './spec/resources/echo.stl';

      var output = FileHandler.executeConversion();
      expect(output.search(/If you can see this then it worked/) >= 0).toBe(true, 'Expected ' + output + ' to contain If you can see this then it worked');

      if (fs.existsSync(FileHandler.stl)) {
        fs.unlink(FileHandler.stl);
      }
    });
  });

  describe('cleanUp', function() {
    function createTempFile(path) {
      fs.closeSync(fs.openSync(path, 'w'));
    }

    it('should delete the files associated', function() {
      FileHandler.scad = './spec/resources/delet-this.scad';
      FileHandler.stl = './spec/resources/delet-this.stl';

      createTempFile(FileHandler.scad);
      createTempFile(FileHandler.stl);

      FileHandler.cleanUp();

      expect(fs.existsSync(FileHandler.scad)).toBe(false, 'scad file');
      expect(fs.existsSync(FileHandler.stl)).toBe(false, 'stl file');
    });
  });

  describe('getOutputLine', function() {
    it('should get the line after \'UnitTestSCAD\'', function() {
      expect(FileHandler.getOutputLine([
        'Hi',
        'UnitTestSCAD',
        'Generic'
      ])).toBe('Generic');

      expect(FileHandler.getOutputLine([
        'UnitTestSCAD',
        'Different',
        'Unique'
      ])).toBe('Different');

      expect(FileHandler.getOutputLine([
        'Alex',
        'Comma',
        'UnitTestSCAD',
        'Safety'
      ])).toBe('Safety');
    });
  });

  describe('getVertices', function() {
    it('should return the vertices found in the form of \'vertex <int> <int> <int>\'', function() {
      expect(FileHandler.getVertices(
        'hemlock' + os.EOL + 
        'clever' + os.EOL + 
        'vertex 5 4 3' + os.EOL + 
        'swag' + os.EOL + 
        'vertex 10 0 5'
      )).toEqual([[5, 4, 3], [10, 0, 5]]);
    });

    it('should uniquify the vertices in a given list', function() {
      expect(FileHandler.getVertices(
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
      expect(FileHandler.countTriangles(
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