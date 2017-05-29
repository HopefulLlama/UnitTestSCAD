var os = require('os');

var FunctionAssertions = require('../../src/tester/FunctionAssertions');
var Tester = require('../../src/tester/Tester');

describe('FunctionAssertions', function() {
  var functionAssertions, TESTER;
  var ECHO = 'ECHO: ';
  describe('outputToBe', function() {
    beforeEach(function() { 
      TESTER = {
        'output': ['fake', ECHO + Tester.START_MARKER, ECHO + 'cat', ECHO + Tester.END_MARKER].join(os.EOL),
        'test': {
          'assertions': 0,
          'failures': [],
        }
      };

      functionAssertions = new FunctionAssertions();
      functionAssertions.tester = TESTER;
    });

    var failingTestCases = ['fake', 'lion', 'tiger', 'lynx', 'spider'];

    var assertAssertionsAndFailures = function(assertions, failures) {
      expect(functionAssertions.tester.test.assertions).toBe(assertions);
      expect(functionAssertions.tester.test.failures.length).toBe(failures);
    };

    describe('Positive Assertion', function() {
      var assertOutput = function(output, assertions, failures) {
        expect(functionAssertions.outputToBe(output)).toEqual({'and': functionAssertions});
        assertAssertionsAndFailures(assertions, failures);
      };
      
      it('should fail if you only attempt a substring', function() {
        assertOutput('ca', 1, 1);
      });

      it('should pass if the phrase is in between the markers', function() {
        assertOutput('cat', 1, 0);
        assertOutput('cat', 2, 0);
      });

      it('should fail if the phrase is not in between the markers', function() {
        failingTestCases.forEach(function(failingTestCase, index) {
          assertOutput(failingTestCase, index+1, index+1);
          expect(functionAssertions.tester.test.failures[index]).toBe('Expected <cat> to be <' + failingTestCase + '>.');
        });
      });
    });

    describe('Negative Assertion', function() {
      var assertNotOutput = function(output, assertions, failures) {
        expect(functionAssertions.not().outputToBe(output)).toEqual({'and': functionAssertions});
        assertAssertionsAndFailures(assertions, failures);
      };

      it('shoud pass if the phrase is not in between the markers', function() {
        failingTestCases.forEach(function(passingTestCase, index) {
          assertNotOutput(passingTestCase, index+1, 0);
        });
      });

      it('should fail if the phrase is contained in the output', function() {
        assertNotOutput('cat', 1, 1);
        expect(functionAssertions.tester.test.failures[0]).toBe('Expected <cat> not to be <cat>.');

        assertNotOutput('cat', 2, 2);
        expect(functionAssertions.tester.test.failures[1]).toBe('Expected <cat> not to be <cat>.');
      });
    });
  });
});