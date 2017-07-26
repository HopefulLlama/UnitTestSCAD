var fs = require('fs');
var os = require('os');

var FileHandler = require('../../../src/util/FileHandler');

var ORIGINAL_SCAD = FileHandler.scad;
var ORIGINAL_STL = FileHandler.stl;
var ORIGINAL_SVG = FileHandler.svg;


function TestCase(scad, expectation, converter) {
  this.scad = scad;
  this.expectation = expectation;
  this.converter = converter;
}

function cleanUp(files) {
  files = (files !== undefined) ? files : [FileHandler.scad, FileHandler.stl, FileHandler.svg];
  files.forEach(function(file) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}

function resetFileHandler() {
  FileHandler.scad = ORIGINAL_SCAD;
  FileHandler.stl = ORIGINAL_STL;
  FileHandler.svg = ORIGINAL_SVG;  
}

describe('FileHandler', function() {
  describe('writeScadFile', function() {
    var HEADER = 'use <"Fake.scad">';
    var BODY = 'cube([1, 1, 1]);';

    beforeEach(function() {
      FileHandler.scad = './spec/unit/resources/itshouldwriteascadfile.scad';
    });

    afterEach(function() {
      cleanUp();
      resetFileHandler();
    });

    it('should write a .scad file', function() {
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

  describe('convertTo', function() {
    var STL = './spec/unit/resources/echo.stl';
    var SVG = './spec/unit/resources/echo-again.svg';

    var SEARCH = /If you can see this then it worked/;
    var expectation = function(output) {
      return 'Expected ' + output + ' to contain If you can see this then it worked';
    };

    beforeEach(function() {
      FileHandler.stl = STL;
      FileHandler.svg = SVG;
    });

    afterEach(function() {
      cleanUp([STL, SVG]);
      resetFileHandler();
    });

    it('should capture the output of convertToStl', function() {
      FileHandler.scad = './spec/unit/resources/echo.scad';

      var output = FileHandler.convertToStl();
      expect(output.search(SEARCH) >= 0).toBe(true, expectation(output));
      expect(fs.existsSync(FileHandler.stl)).toBe(true, FileHandler.stl);
    });

    it('should capture the output of convertToSvg', function() {
      FileHandler.scad = './spec/unit/resources/echo-again.scad';

      var output = FileHandler.convertToSvg();
      expect(output.search(SEARCH) >= 0).toBe(true, expectation(output));
      expect(fs.existsSync(FileHandler.svg)).toBe(true, FileHandler.svg);
    });

    [
      FileHandler.convertToStl,
      FileHandler.convertToSvg
    ].forEach(function(func) {
      it('should throw on conversion attempt', function() {
        FileHandler.scad = './spec/unit/resources/garbage.scad';

        expect(func).toThrow();
      }); 
    });
  });
  
  [
    new TestCase('./spec/unit/resources/cube.scad', './spec/unit/resources/cube.stl', 'getStlContent'),
    new TestCase('./spec/unit/resources/square.scad', './spec/unit/resources/square.svg', 'getSvgContent')
  ].forEach(function(testCase) {
    describe(testCase.converter, function() {
      afterEach(function() {
        cleanUp([FileHandler.stl, FileHandler.svg]);
        resetFileHandler();
      });

      it('should convert', function() {
        FileHandler.scad = testCase.scad;

        var output = FileHandler[testCase.converter]();
        expect(output).toBe(fs.readFileSync(testCase.expectation, 'utf8'));
      });
    });
  });

  describe('cleanUp', function() {
    function createTempFile(path) {
      fs.closeSync(fs.openSync(path, 'w'));
    }

    afterEach(function() {
      cleanUp();
      resetFileHandler();
    });

    it('should delete the files associated', function() {
      FileHandler.scad = './spec/unit/resources/delet-this.scad';
      FileHandler.stl = './spec/unit/resources/delet-this.stl';
      FileHandler.svg = './spec/unit/resources/delet-this.svg';

      var files = [FileHandler.scad, FileHandler.stl, FileHandler.svg];
      files.forEach(function(file) {
        createTempFile(file);
      });

      FileHandler.cleanUp();

      files.forEach(function(file) {
        expect(fs.existsSync(file)).toBe(false, file);
      });
    });
  });
});