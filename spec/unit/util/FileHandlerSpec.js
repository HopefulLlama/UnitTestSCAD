const fs = require('fs');
const os = require('os');

const FileHandler = require('../../../src/util/FileHandler');

const ORIGINAL_SCAD = FileHandler.scad;
const ORIGINAL_STL = FileHandler.stl;
const ORIGINAL_SVG = FileHandler.svg;


function TestCase(scad, expectation, converter) {
  this.scad = scad;
  this.expectation = expectation;
  this.converter = converter;
}

function cleanUp(files) {
  files = (files !== undefined) ? files : [FileHandler.scad, FileHandler.stl, FileHandler.svg];
  files.forEach(file => {
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

describe('FileHandler', () => {
  describe('writeScadFile', () => {
    const HEADER = 'use <"Fake.scad">';
    const BODY = 'cube([1, 1, 1]);';

    beforeEach(() => FileHandler.scad = './spec/unit/resources/itshouldwriteascadfile.scad');

    afterEach(() => {
      cleanUp();
      resetFileHandler();
    });

    it('should write a .scad file', () => {
      FileHandler.writeScadFile(HEADER, 'swag', BODY);

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.readFileSync(FileHandler.scad, 'utf8')).toBe(HEADER + os.EOL + 'swag' + os.EOL + BODY);
    });

    it('should write a .scad file, ignoring set up', () => {
      FileHandler.writeScadFile(HEADER, null, BODY);

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.readFileSync(FileHandler.scad, 'utf8')).toBe(HEADER + os.EOL + BODY);
    });
  });

  describe('convertTo', () => {
    const STL = './spec/unit/resources/echo.stl';
    const SVG = './spec/unit/resources/echo-again.svg';

    const SEARCH = /If you can see this then it worked/;
    const expectation = output => {
      return 'Expected ' + output + ' to contain If you can see this then it worked';
    };

    beforeEach(() => {
      FileHandler.stl = STL;
      FileHandler.svg = SVG;
    });

    afterEach(() => {
      cleanUp([STL, SVG]);
      resetFileHandler();
    });

    it('should capture the output of convertToStl', () => {
      FileHandler.scad = './spec/unit/resources/echo.scad';

      const output = FileHandler.convertToStl();
      expect(output.search(SEARCH) >= 0).toBe(true, expectation(output));
      expect(fs.existsSync(FileHandler.stl)).toBe(true, FileHandler.stl);
    });

    it('should capture the output of convertToSvg', () => {
      FileHandler.scad = './spec/unit/resources/echo-again.scad';

      const output = FileHandler.convertToSvg();
      expect(output.search(SEARCH) >= 0).toBe(true, expectation(output));
      expect(fs.existsSync(FileHandler.svg)).toBe(true, FileHandler.svg);
    });

    [
      FileHandler.convertToStl,
      FileHandler.convertToSvg
    ].forEach(func => {
      it('should throw on conversion attempt', () => {
        FileHandler.scad = './spec/unit/resources/garbage.scad';

        expect(func).toThrow();
      });
    });
  });

  [
    new TestCase('./spec/unit/resources/cube.scad', './spec/unit/resources/cube.stl', 'getStlContent'),
    new TestCase('./spec/unit/resources/square.scad', './spec/unit/resources/square.svg', 'getSvgContent')
  ].forEach(testCase => {
    describe(testCase.converter, () => {
      afterEach(() => {
        cleanUp([FileHandler.stl, FileHandler.svg]);
        resetFileHandler();
      });

      it('should convert', () => {
        FileHandler.scad = testCase.scad;

        const output = FileHandler[testCase.converter]();
        expect(output).toBe(fs.readFileSync(testCase.expectation, 'utf8'));
      });
    });
  });

  describe('cleanUp', () => {
    function createTempFile(path) {
      fs.closeSync(fs.openSync(path, 'w'));
    }

    afterEach(() => {
      cleanUp();
      resetFileHandler();
    });

    it('should delete the files associated', () => {
      FileHandler.scad = './spec/unit/resources/delet-this.scad';
      FileHandler.stl = './spec/unit/resources/delet-this.stl';
      FileHandler.svg = './spec/unit/resources/delet-this.svg';

      const files = [FileHandler.scad, FileHandler.stl, FileHandler.svg];
      files.forEach(createTempFile);

      FileHandler.cleanUp();

      files.forEach(file => expect(fs.existsSync(file)).toBe(false, file));
    });
  });
});