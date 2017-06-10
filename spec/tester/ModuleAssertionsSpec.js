var os = require('os');

var ModuleAssertions = require('../../src/tester/ModuleAssertions');

describe('ModuleAssertions', function() {
  var moduleAssertions, OUTPUT;

  var FILE = 'spec/resources/garbage.stl';

  function generateTester(output) {
    return {
      'output': output,
      'test': {
        'assertions': 0,
        'failures': []
      }
    };
  }

  var assertAssertionsAndFailures = function(assertions, failures) {
    expect(moduleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
    expect(moduleAssertions.tester.test.failures.length).toBe(failures, 'failures');
  };

  var assertStlFile = function(filePath, assertions, failures) {
    expect(moduleAssertions.stlFileToBe(filePath)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertNotStlFile = function(filePath, assertions, failures) {
    expect(moduleAssertions.not().stlFileToBe(filePath)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertVertexCount = function(vertices, assertions, failures) {
    expect(moduleAssertions.toHaveVertexCountOf(vertices)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertNotVertexCount = function(vertices, assertions, failures) {
    expect(moduleAssertions.not().toHaveVertexCountOf(vertices)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertTriangleCount = function(triangles, assertions, failures) {
    expect(moduleAssertions.toHaveTriangleCountOf(triangles)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertNotTriangleCount = function(triangles, assertions, failures) {
    expect(moduleAssertions.not().toHaveTriangleCountOf(triangles)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertBoundingBox = function(bounds, assertions, failures) {
    expect(moduleAssertions.toBeWithinBoundingBox(bounds)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  var assertNotBoundingBox = function(bounds, assertions, failures) {
    expect(moduleAssertions.not().toBeWithinBoundingBox(bounds)).toEqual({'and': moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  };

  describe('with test file output', function() {
    var actual = [[0, 0, 0], [3, 0, 3], [3, 3, 3]].toString();
    beforeEach(function() {
	    OUTPUT = ['garbage', 'vertex 0 0 0', 'vertex 3 0 3', 'endfacet', 'endfacet', 'vertex 3 3 3'].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should fail to compare STL files', function() {
      for (var i = 1; i <= 3; i++) {
        assertStlFile(FILE, i, i);
        expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected <' + moduleAssertions.tester.output + '> to be <garbage>.');
      }
    });

    it('should pass on not STL files', function() {
      for (var i = 1; i <= 3; i++) {
        assertNotStlFile(FILE, i, 0);
      }
    });

    it('should correctly count the number of vertices', function() {
      assertVertexCount(3, 1, 0);
    });

    it('should fail on not counting the number of vertices', function() {
      assertNotVertexCount(3, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <3> not to be <3>.');
    });

    it('should pass if the count of vertices does not match', function() {
      for(var i = 1; i <= 10; i++) {
        assertNotVertexCount(5, i, 0);
      }
    });

    it('should fail if the count of vertices does not match', function() {
      for(var i = 1; i <= 10; i++) {
        assertVertexCount(5, i, i);
        expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected <3> to be <5>.');
      }
    });

    it('should correctly count the number of triangles', function() {
      assertTriangleCount(2, 1, 0);
    });

    it('should fail not if the count of number of triangles matches', function() {
      assertNotTriangleCount(2, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <2> not to be <2>.');
    });

    it('should pass if the count of triangles does not match', function () {
      for(var i = 1; i <= 10; i++) {
        assertNotTriangleCount(5, i, 0);
      }
    });

    it('should fail if the count of triangles does not match', function() {
      for(var i = 1; i <= 10; i++) {
        assertTriangleCount(5, i, i);
        expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected <2> to be <5>.');
      }
    });

    it('should correctly be within bounds', function() {
      assertBoundingBox([[0, 0, 0], [3, 3, 3]], 1, 0);
    });

    it('should fail not if within bounds', function() {
      var expected = [[0, 0, 0], [3, 3, 3]];
      assertNotBoundingBox(expected, 1, 1);
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
        assertNotBoundingBox(testCase, index+1, 0);
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
        assertBoundingBox(testCase, index+1, index+1);
        expect(moduleAssertions.tester.test.failures[index]).toBe('Expected <' + actual + '> to be within the bounds of <' + testCase + '>.');
      });
    });
  });

  describe('with mock file output', function() {
    beforeEach(function() {
      OUTPUT = 'garbage';

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should compare stl successfully', function() {
      assertStlFile(FILE, 1, 0);
    });

    it('should fail stl not comparison', function() {
      assertNotStlFile(FILE, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe('Expected <' + moduleAssertions.tester.output + '> not to be <garbage>.');
    });
  });
});