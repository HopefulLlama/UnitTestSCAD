var fs = require('fs');
var os = require('os');

var AssertionGenerator = require('../../../src/tester/AssertionGenerator');
var FileHandler = require('../../../src/util/FileHandler');

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
  	[FileHandler.scad, FileHandler.stl, FileHandler.svg].forEach(function(file) {
	    if(fs.existsSync(file)) {
	      fs.unlinkSync(file);
	    }
	  });
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

  ['openScadModule', 'openScad3DModule'].forEach(function(func) {
    it('should create a ModuleTester using ' + func + ' with correct values', function() {
      var test = 'cube(1);';
      var tester = assertionGenerator.withSetup(SETUP)[func](test).tester;

      expect(fs.existsSync(FileHandler.scad)).toBe(true);
      expect(fs.existsSync(FileHandler.stl)).toBe(true);
      expect(tester.output).toEqual(fs.readFileSync(FileHandler.stl, 'utf8'));

      expect(tester.setUpText).toEqual(SETUP);
      expect(tester.testText).toEqual(test);
    });
  });

  it('should create a TwoDModuleTester with correct values', function() {
    var setup = 'translate([5, 5]) {square(1);}';
    var test = 'square(1);';
    var tester = assertionGenerator.withSetup(setup).openScad2DModule(test).tester;

    expect(fs.existsSync(FileHandler.scad)).toBe(true);
    expect(fs.existsSync(FileHandler.svg)).toBe(true);
    expect(tester.output).toEqual(fs.readFileSync(FileHandler.svg, 'utf8'));

    expect(tester.setUpText).toEqual(setup);
    expect(tester.testText).toEqual(test);
  });
});