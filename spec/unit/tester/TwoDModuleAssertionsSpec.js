var os = require('os');

var TwoDModuleAssertions = require('../../../src/tester/TwoDModuleAssertions');

describe('TwoDModuleAssertions', function() {
  var twoDModuleAssertions;

  var FILE = 'spec/unit/resources/garbage.svg';

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

  function assertSvgFile(filePath, assertions, failures) {
    expect(twoDModuleAssertions.svgFileToBe(filePath)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNotSvgFile(filePath, assertions, failures) {
    expect(twoDModuleAssertions.not().svgFileToBe(filePath)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertHeight(height, assertions, failures) {
    expect(twoDModuleAssertions.heightToBe(height)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNotHeight(height, assertions, failures) {
    expect(twoDModuleAssertions.not().heightToBe(height)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertWidth(width, assertions, failures) {
    expect(twoDModuleAssertions.widthToBe(width)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNotWidth(width, assertions, failures) {
    expect(twoDModuleAssertions.not().widthToBe(width)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertVertexCount(count, assertions, failures) {
    expect(twoDModuleAssertions.toHaveVertexCountOf(count)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNotVertexCount(count, assertions, failures) {
    expect(twoDModuleAssertions.not().toHaveVertexCountOf(count)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertBoundingBox(vectors, assertions, failures) {
    expect(twoDModuleAssertions.toBeWithinBoundingBox(vectors)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNotBoundingBox(vectors, assertions, failures) {
    expect(twoDModuleAssertions.not().toBeWithinBoundingBox(vectors)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  describe('with test file output', function() {
    var actual = [
      [6, 6], [5, 6], [5, 5], [6, 5],
      [1, 1], [0, 1], [0, 0], [1, 0]
    ].toString();

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
      assertSvgFile(FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.output + '> to be <garbage>.');
    });

    it('should pass svg not comparison', function() {
      assertNotSvgFile(FILE, 1, 0);
    });

    it('should pass height', function() {
      assertHeight(10, 1, 0);
    });

    it('should fail height', function() {
      assertHeight(20, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.parsedOutput.$.height + '> to be <20>.');
    });

    it('should pass not height', function() {
      assertNotHeight(20, 1, 0);
    });

    it('should fail not height', function() {
      assertNotHeight(10, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.parsedOutput.$.height + '> not to be <10>.');
    });

    it('should pass width', function() {
      assertWidth(10, 1, 0);
    });

    it('should fail width', function() {
      assertWidth(20, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.parsedOutput.$.width + '> to be <20>.');
    });

    it('should pass not width', function() {
      assertNotWidth(20, 1, 0);
    });

    it('should fail not width', function() {
      assertNotWidth(10, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.parsedOutput.$.width + '> not to be <10>.');
    });
    
    it('should pass vertex count', function() {
      assertVertexCount(8, 1, 0);
    });

    it('should fail vertex count', function() {
      assertVertexCount(20, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <8> to be <20>.');
    });

    it('should pass not vertex count', function() {
      assertNotVertexCount(20, 1, 0);
    });

    it('should fail not vertex count', function() {
      assertNotVertexCount(8, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <8> not to be <8>.');
    });

    it('should pass bounding box', function() {
      assertBoundingBox([[0, 0], [6, 6]], 1, 0);
    });

    it('should fail bounding box on any dimensions', function() {
      [
        [[1, 0], [6, 6]],
        [[0, 1], [6, 6]],
        [[0, 0], [5, 6]],
        [[0, 0], [6, 5]],
      ].forEach(function(failingVectors, index) {
        assertBoundingBox(failingVectors, index+1, index+1);
        expect(twoDModuleAssertions.tester.test.failures[index]).toBe('Expected <' + actual + '> to be within the bounds of <' + failingVectors.toString() + '>.');
      });
    });
    

    it('should pass not bounding box', function() {
      assertNotBoundingBox([[1, 1], [5, 5]], 1, 0);
    });

    it('should fail not bounding box', function() {
      var expected = [[0, 0], [6, 6]];
      assertNotBoundingBox(expected, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + actual + '> not to be within the bounds of <' + expected.toString() + '>.');
    });
  });

  describe('with mock file output', function() {
    beforeEach(function() {
      twoDModuleAssertions = new TwoDModuleAssertions();
      twoDModuleAssertions.tester = generateTester('garbage');
    });

    it('should compare svg successfully', function() {
      assertSvgFile(FILE, 1, 0);
    });

    it('should fail svg not comparison', function() {
      assertNotSvgFile(FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe('Expected <' + twoDModuleAssertions.tester.output + '> not to be <garbage>.');
    });
  });
});