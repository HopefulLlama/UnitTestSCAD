var fs = require('fs');
var os = require('os');

var AssertionGenerator = require('../../src/tester/AssertionGenerator');
var FileHandler = require('../../src/util/FileHandler');


describe('AssertionGenerator', function() {
  var assertionGenerator;

  var CONFIG = {
    properties: ''
  };
  var TEST_RUNNER = {
    current: {
      test: {
        testSuite: {
          getHeader: function() {return '';}
        }
      }
    }
  };

  var SETUP = 'translate([5, 5, 5]) {cube(1);}';

  beforeEach(function() {
    assertionGenerator = new AssertionGenerator(CONFIG, TEST_RUNNER);
  });

  afterEach(function() {
    if(fs.existsSync(FileHandler.scad)) {
      fs.unlink(FileHandler.scad);
    }

    if(fs.existsSync(FileHandler.stl)) {
      fs.unlink(FileHandler.stl);
    }
  });

  it('should return itself and setup', function() {
    var text = 'Hello';
    var result = assertionGenerator.withSetup(text);

    expect(result).toBe(assertionGenerator);
    expect(assertionGenerator.__setUp).toBe(text);
  });

  it('should create a FunctionTester with correct values', function() {
    var test = '"Hello";';
    var tester = assertionGenerator.withSetup(SETUP).openScadFunction(test).tester;

    expect(fs.existsSync(FileHandler.scad)).toBe(true);
    expect(tester.output).toEqual([
      'ECHO: "UnitTestSCAD __start_marker__"',
      'ECHO: "Hello"',
      'ECHO: "UnitTestSCAD __end_marker__"'
    ].join(os.EOL) + os.EOL);

    expect(tester.setUpText).toEqual(SETUP);
    expect(tester.testText).toEqual([
      'echo("UnitTestSCAD __start_marker__");', 
      'echo("Hello");', 
      'echo("UnitTestSCAD __end_marker__");', 
      'cube(1);'
    ].join(os.EOL));
  });

  it('should create a ModuleTester with correct values', function() {
    var test = 'cube(1);';
    var tester = assertionGenerator.withSetup(SETUP).openScadModule(test).tester;

    expect(fs.existsSync(FileHandler.scad)).toBe(true);
    expect(fs.existsSync(FileHandler.stl)).toBe(true);
    expect(tester.output).toEqual(fs.readFileSync(FileHandler.stl, 'utf8'));

    expect(tester.setUpText).toEqual(SETUP);
    expect(tester.testText).toEqual(test);
  });
});