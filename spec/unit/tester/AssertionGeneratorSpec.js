const fs = require('fs');
const os = require('os');

const AssertionGenerator = require('../../../src/tester/AssertionGenerator');
const FileHandler = require('../../../src/util/FileHandler');

describe('AssertionGenerator', () => {
  let assertionGenerator;

  const CONFIG = {
    properties: ''
  };
  const TEST_RUNNER = {
    current: {
      test: {
        testSuite: {
          getHeader: () => {return '';}
        }
      }
    }
  };

  const SETUP = 'translate([5, 5, 5]) {cube(1);}';

  beforeEach(() => assertionGenerator = new AssertionGenerator(CONFIG, TEST_RUNNER));

  afterEach(() => {
    [FileHandler.scad, FileHandler.stl, FileHandler.svg].forEach(file => {
      if(fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  });

  it('should return itself and setup', () => {
    const text = 'Hello';
    const result = assertionGenerator.withSetup(text);

    expect(result).toBe(assertionGenerator);
    expect(assertionGenerator.__setUp).toBe(text);
  });

  it('should create a FunctionTester with correct values', () => {
    const test = '"Hello";';
    const tester = assertionGenerator.withSetup(SETUP).openScadFunction(test).tester;

    expect(fs.existsSync(FileHandler.scad)).toBe(true);
    expect(tester.output).toEqual('"Hello"');

    expect(tester.setUpText).toEqual(SETUP);
    expect(tester.testText).toEqual([
      'echo("UnitTestSCAD __start_marker__");',
      'echo("Hello");',
      'echo("UnitTestSCAD __end_marker__");',
      'cube(1);'
    ].join(os.EOL));
  });

  ['openScadModule', 'openScad3DModule'].forEach(func => {
    it(`should create a ModuleTester using ${func} with correct values`, () => {
      const test = 'cube(1);';
      const tester = assertionGenerator.withSetup(SETUP)[func](test).tester;

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.existsSync(FileHandler.stl)).toBe(true);
      expect(tester.output).toEqual(fs.readFileSync(FileHandler.stl, 'utf8'));

      expect(tester.setUpText).toEqual(SETUP);
      expect(tester.testText).toEqual(test);
    });
  });

  it('should create a TwoDModuleTester with correct values', () => {
    const setup = 'translate([5, 5]) {square(1);}';
    const test = 'square(1);';
    const tester = assertionGenerator.withSetup(setup).openScad2DModule(test).tester;

    expect(fs.existsSync(FileHandler.scad)).toBe(true);
    expect(fs.existsSync(FileHandler.svg)).toBe(true);
    expect(tester.output).toEqual(fs.readFileSync(FileHandler.svg, 'utf8'));

    expect(tester.setUpText).toEqual(setup);
    expect(tester.testText).toEqual(test);
  });
});