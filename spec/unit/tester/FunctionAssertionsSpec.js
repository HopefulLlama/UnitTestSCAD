const os = require('os');

const FunctionAssertions = require('../../../src/tester/FunctionAssertions');

describe('FunctionAssertions', () => {
  let functionAssertions, TESTER;
  describe('outputToBe', () => {
    beforeEach(() => {
      TESTER = {
        'output': ['cat'].join(os.EOL),
        'test': {
          'assertions': 0,
          'failures': [],
        }
      };

      functionAssertions = new FunctionAssertions();
      functionAssertions.tester = TESTER;
    });

    const failingTestCases = ['fake', 'lion', 'tiger', 'lynx', 'spider'];

    function assertAssertionsAndFailures(assertions, failures) {
      expect(functionAssertions.tester.test.assertions).toBe(assertions);
      expect(functionAssertions.tester.test.failures.length).toBe(failures);
    }

    describe('Positive Assertion', () => {
      function assertOutput(output, assertions, failures) {
        expect(functionAssertions.outputToBe(output)).toEqual({'and': functionAssertions});
        assertAssertionsAndFailures(assertions, failures);
      }

      it('should fail if you only attempt a substring', () => assertOutput('ca', 1, 1));

      it('should pass if the phrase exists', () => {
        assertOutput('cat', 1, 0);
        assertOutput('cat', 2, 0);
      });

      it('should fail if the phrase does not exist', () => {
        failingTestCases.forEach((failingTestCase, index) => {
          assertOutput(failingTestCase, index+1, index+1);
          expect(functionAssertions.tester.test.failures[index]).toBe(`Expected <cat> to be <${failingTestCase}>.`);
        });
      });
    });

    describe('Negative Assertion', () => {
      function assertNotOutput(output, assertions, failures) {
        expect(functionAssertions.not().outputToBe(output)).toEqual({and: functionAssertions});
        assertAssertionsAndFailures(assertions, failures);
      }

      it('shoud pass if the phrase does not exist', () => {
        failingTestCases.forEach((passingTestCase, index) => assertNotOutput(passingTestCase, index+1, 0));
      });

      it('should fail if the phrase exists', () => {
        assertNotOutput('cat', 1, 1);
        expect(functionAssertions.tester.test.failures[0]).toBe('Expected <cat> not to be <cat>.');

        assertNotOutput('cat', 2, 2);
        expect(functionAssertions.tester.test.failures[1]).toBe('Expected <cat> not to be <cat>.');
      });
    });
  });
});