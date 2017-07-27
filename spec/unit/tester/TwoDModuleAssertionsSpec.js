var os = require('os');

var TwoDModuleAssertions = require('../../../src/tester/TwoDModuleAssertions');

describe('TwoDModuleAssertions', function() {
  var twoDModuleAssertions;

  var FILE = 'spec/unit/resources/garbage.svg';

  var SVG_FILE = 'svgFileToBe';
  var HEIGHT = 'heightToBe';
  var WIDTH = 'widthToBe';
  var VERTEX_COUNT = 'toHaveVertexCountOf';
  var BOUNDING_BOX = 'toBeWithinBoundingBox';
  var CONTAINING_VERTICES = 'toContainVertices';
  var EXACT_VERTICES = 'toHaveExactVertices';

  function generateTester(output, parsedOutput) {
    return {
      'output': output,
      'parsedOutput': (parsedOutput !== undefined) ? parsedOutput : {},
      'test': {
        'assertions': 0,
        'failures': []
      }
    };
  }

  function assertAssertionsAndFailures(assertions, failures) {
    expect(twoDModuleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
    expect(twoDModuleAssertions.tester.test.failures.length).toBe(failures, 'failures');
  }

    function assert(func, expectation, assertions, failures) {
    expect(twoDModuleAssertions[func](expectation)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNot(func, expectation, assertions, failures) {
    expect(twoDModuleAssertions.not()[func](expectation)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function TestCase(func, pass, fail, conjunction) {
    this.func = func;
    this.pass = pass;
    this.fail = fail;
    this.conjunction = (conjunction !== undefined) ? conjunction : 'to be';
  }

  TestCase.prototype.doTests = function() {
    var test = this;

    it(test.func + ' should pass', function() {
      assert(test.func, test.pass, 1, 0);
    });

    it(test.func + ' should fail', function() {
      assert(test.func, test.fail, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + test.pass + '> ' + test.conjunction + ' <' + test.fail + '>.');
    });

    it('not ' + test.func + ' should pass', function() {
      assertNot(test.func, test.fail, 1, 0);
    });

    it('not ' + test.func + ' should fail', function() {
      assertNot(test.func, test.pass, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + test.pass + '> not ' + test.conjunction + ' <' + test.pass + '>.');
    });
  };

  describe('with test file output', function() {
    var actual = [
      [6, 6], [5, 6], [5, 5], [6, 5],
      [1, 1], [0, 1], [0, 0], [1, 0]
    ];

    beforeEach(function() {
      var parsedOutput = {
        '$': {
          'height': 10,
          'width': 10
        },
        'path': [{
          '$': {
            'd': os.EOL + 'M 6,6 L 5,6 L 5,5 L 6,5 z' + os.EOL + 'M 1,1 L 0,1 L 0,0 L 1,0 z' + os.EOL
          }
        }]
      };

      twoDModuleAssertions = new TwoDModuleAssertions();
      twoDModuleAssertions.tester = generateTester('not garbage', parsedOutput);
    });

    it('should fail to compare svg file', function() {
      assert(SVG_FILE, FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.output + '> to be <garbage>.');
    });

    it('should pass svg not comparison', function() {
      assertNot(SVG_FILE, FILE, 1, 0);
    });

    [
    	new TestCase(HEIGHT, 10, 20),
    	new TestCase(WIDTH, 10, 20),
    	new TestCase(VERTEX_COUNT, 8, 20),
    	new TestCase(CONTAINING_VERTICES, actual, [[0,3]], 'to contain all vertices in'),
    	new TestCase(EXACT_VERTICES, actual, [[0,3]], 'to have exactly all vertices in')
    ].forEach(function(testCase) {
    	testCase.doTests();
    });

    it('should pass bounding box', function() {
      assert(BOUNDING_BOX, [[0, 0], [6, 6]], 1, 0);
    });

    it('should fail bounding box on any dimensions', function() {
      [
        [[1, 0], [6, 6]],
        [[0, 1], [6, 6]],
        [[0, 0], [5, 6]],
        [[0, 0], [6, 5]],
      ].forEach(function(failingVectors, index) {
        assert(BOUNDING_BOX, failingVectors, index+1, index+1);
        expect(twoDModuleAssertions.tester.test.failures[index]).toBe('Expected <' + actual.toString() + '> to be within the bounds of <' + failingVectors.toString() + '>.');
      });
    });
    

    it('should pass not bounding box', function() {
      assertNot(BOUNDING_BOX, [[1, 1], [5, 5]], 1, 0);
    });

    it('should fail not bounding box', function() {
      var expected = [[0, 0], [6, 6]];
      assertNot(BOUNDING_BOX, expected, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + actual.toString() + '> not to be within the bounds of <' + expected.toString() + '>.');
    });
  });

  describe('with mock file output', function() {
    beforeEach(function() {
      twoDModuleAssertions = new TwoDModuleAssertions();
      twoDModuleAssertions.tester = generateTester('garbage');
    });

    it('should compare svg successfully', function() {
      assert(SVG_FILE, FILE, 1, 0);
    });

    it('should fail svg not comparison', function() {
      assertNot(SVG_FILE, FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.output + '> not to be <garbage>.');
    });
  });
});