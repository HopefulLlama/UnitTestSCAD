var FunctionAssertions = require('../../src/tester/FunctionAssertions');

describe('FunctionAssertions', function() {
  var functionAssertions, TESTER;
  describe('outputToBe', function() {
    beforeEach(function() { 
      TESTER = {
        'output': 'cat dog mouse llama hello',
        'test': {
          'assertions': 0,
          'failures': [],
        }
      };

      functionAssertions = new FunctionAssertions();
      functionAssertions.tester = TESTER;
    });

    var assertAssertionsAndFailures = function(assertions, failures) {
      expect(functionAssertions.tester.test.assertions).toBe(assertions);
      expect(functionAssertions.tester.test.failures.length).toBe(failures);
    };

    var assertOutput = function(output, assertions, failures) {
      expect(functionAssertions.outputToBe(output)).toEqual({'and': functionAssertions});
      assertAssertionsAndFailures(assertions, failures);
    };

    var assertNotOutput = function(output, assertions, failures) {
      expect(functionAssertions.not().outputToBe(output)).toEqual({'and': functionAssertions});
      assertAssertionsAndFailures(assertions, failures);
    };

    it('should pass if the phrase is contained in the output', function() {
      TESTER.output.split(' ').forEach(function(passingTestCase, index) {
        assertOutput(passingTestCase, index+1, 0);
      });
    });

    it('should fail if the phrase is not contained in the output', function() {
      ['lion', 'tiger', 'lynx', 'spider'].forEach(function(failingTestCase, index) {
        assertOutput(failingTestCase, index+1, index+1);
        expect(functionAssertions.tester.test.failures[index]).toBe('Expected <' + functionAssertions.tester.output + '> to contain <' + failingTestCase + '>.');
      });
    });

    it('shoud pass if the phrase is not contained in the output', function() {
      ['lion', 'tiger', 'lynx', 'spider'].forEach(function(passingTestCase, index) {
        assertNotOutput(passingTestCase, index+1, 0);
      });
    });

    it('should fail if the phrase is contained in the output', function() {
      TESTER.output.split(' ').forEach(function(failingTestCase, index) {
        assertNotOutput(failingTestCase, index+1, index+1);
        expect(functionAssertions.tester.test.failures[index]).toBe('Expected <' + functionAssertions.tester.output + '> not to contain <' + failingTestCase + '>.');
      });
    });
  });
});