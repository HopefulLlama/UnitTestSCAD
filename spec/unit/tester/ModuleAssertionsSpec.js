var os = require('os');

var ModuleAssertions = require('../../../src/tester/ModuleAssertions');

describe('ModuleAssertions', function() {
  var moduleAssertions, OUTPUT;

  var FILE = 'spec/unit/resources/garbage.stl';

  var STL_FILE = 'stlFileToBe';
  var VERTEX_COUNT = 'toHaveVertexCountOf';
  var TRIANGLE_COUNT = 'toHaveTriangleCountOf';
  var BOUNDING_BOX = 'toBeWithinBoundingBox';
  var WIDTH = 'widthToBe';
  var HEIGHT = 'heightToBe';
  var DEPTH = 'depthToBe';

  function generateTester(output) {
    return {
      'output': output,
      'test': {
        'assertions': 0,
        'failures': []
      }
    };
  }

  function assertAssertionsAndFailures(assertions, failures) {
    expect(moduleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
    expect(moduleAssertions.tester.test.failures.length).toBe(failures, 'failures');
  }

  function assert(func, expectation, assertions, failures) {
    expect(moduleAssertions[func](expectation)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNot(func, expectation, assertions, failures) {
    expect(moduleAssertions.not()[func](expectation)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function TestCase(func, pass, fail) {
    this.func = func;
    this.pass = pass;
    this.fail = fail;
  }

  TestCase.prototype.doTests = function() {
    var test = this;

    it(test.func + ' should pass', function() {
      assert(test.func, test.pass, 1, 0);
    });

    it(test.func + ' should fail', function() {
      assert(test.func, test.fail, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <' + test.pass + '> to be <' + test.fail + '>.');
    });

    it('not ' + test.func + ' should pass', function() {
      assertNot(test.func, test.fail, 1, 0);
    });

    it('not ' + test.func + ' should fail', function() {
      assertNot(test.func, test.pass, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <' + test.pass + '> not to be <' + test.pass + '>.');
    });
  };

  describe('testGetVertices', function() {
  	beforeEach(function() {
  		OUTPUT = [
  			'vertex 0 0 0',
  			'vertex 1 2 3',
  			'vertex 1.1 2.2 3.3',
  			'vertex 11.11 22.22 33.33',
  			'vertex 11.1111 22.222222 33.33333'
  		].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
  	});

  	it('should get the correct number of vertices', function() {
  		var testCase = new TestCase(VERTEX_COUNT, 5, 6);
  		testCase.doTests();
  	});
  });


  describe('with test file output', function() {
    var actual = [[0, 0, 0], [3, 0, 3], [3, 3, 3]].toString();
    beforeEach(function() {
      OUTPUT = [
      	'garbage', 
      	'vertex 0 0 0', 
      	'vertex 3 0 3', 
      	'endfacet', 
      	'endfacet', 
      	'vertex 3 3 3'
    	].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should fail to compare STL files', function() {
      for (var i = 1; i <= 3; i++) {
        assert(STL_FILE, FILE, i, i);
        expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected <' + moduleAssertions.tester.output + '> to be <garbage>.');
      }
    });

    it('should pass on not STL files', function() {
      for (var i = 1; i <= 3; i++) {
        assertNot(STL_FILE, FILE, i, 0);
      }
    });

    [
      new TestCase(VERTEX_COUNT, 3, 5),
      new TestCase(TRIANGLE_COUNT, 2, 5)
    ].forEach(function(testCase) {
      testCase.doTests();
    });

    it('should correctly be within bounds', function() {
      assert(BOUNDING_BOX, [[0, 0, 0], [3, 3, 3]], 1, 0);
    });

    it('should fail not if within bounds', function() {
      var expected = [[0, 0, 0], [3, 3, 3]];
      assertNot(BOUNDING_BOX, expected, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <' + actual + '> not to be within the bounds of <' + expected.toString() + '>.');
    });

    it('should pass if any point is outside the bounds', function() {
      [
        [[1, 0, 0], [3, 3, 3]],
        [[0, 1, 0], [3, 3, 3]],
        [[0, 0, 1], [3, 3, 3]],
        [[0, 0, 0], [2, 3, 3]],
        [[0, 0, 0], [3, 2, 3]],
        [[0, 0, 0], [3, 3, 2]]
      ].forEach(function(testCase, index) {
        assertNot(BOUNDING_BOX, testCase, index+1, 0);
      });
    });

    it('should fail if any point is outside the bounds', function() {
      [
        [[1, 0, 0], [3, 3, 3]],
        [[0, 1, 0], [3, 3, 3]],
        [[0, 0, 1], [3, 3, 3]],
        [[0, 0, 0], [2, 3, 3]],
        [[0, 0, 0], [3, 2, 3]],
        [[0, 0, 0], [3, 3, 2]]
      ].forEach(function(testCase, index) {
        assert(BOUNDING_BOX, testCase, index+1, index+1);
        expect(moduleAssertions.tester.test.failures[index]).toBe('Expected <' + actual + '> to be within the bounds of <' + testCase + '>.');
      });
    });
  });

  describe('with different file output', function() {
    beforeEach(function() {
      OUTPUT = ['vertex 0 0 0', 'vertex 3 0 3', 'vertex 4 5 6'].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    [
      new TestCase(WIDTH, 4, 10),
      new TestCase(HEIGHT, 5, 10),
      new TestCase(DEPTH, 6, 10)
    ].forEach(function(testCase) {
      testCase.doTests();
    });
  });

  describe('with mock file output', function() {
    beforeEach(function() {
      OUTPUT = 'garbage';

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should compare stl successfully', function() {
      assert(STL_FILE, FILE, 1, 0);
    });

    it('should fail stl not comparison', function() {
      assertNot(STL_FILE, FILE, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <' + moduleAssertions.tester.output + '> not to be <garbage>.');
    });
  });
});