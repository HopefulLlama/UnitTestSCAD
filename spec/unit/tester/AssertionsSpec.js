const Assertions = require('../../../src/tester/Assertions');

let assertions;
function getNewTester() {
  return {
    test: {
      assertions: 0,
      failures: []
    }
  };
}

describe('Assertions', () => {
  beforeEach(() => {
    assertions = new Assertions();
  });

  describe('__buildFailureMessage', () => {
    it('should create a failure message', () => {
      expect(assertions.__buildFailureMessage(5, 'to be', 1)).toBe('Expected <5> to be <1>.');
      expect(assertions.__buildFailureMessage('abc', 'wubl', 'asdsad')).toBe('Expected <abc> wubl <asdsad>.');
      expect(assertions.__buildFailureMessage(true, 'a', false)).toBe('Expected <true> a <false>.');

      assertions.positiveAssertion = false;
      expect(assertions.__buildFailureMessage(5, 'to be', 5)).toBe('Expected <5> not to be <5>.');
    });
  });

  describe('with tester', () => {
    beforeEach(() => {
      assertions.tester = getNewTester();
    });

    function assertTester(result, azzertions, count, failures) {
      expect(result).toEqual({'and': assertions});
      expect(azzertions.tester.test.assertions).toBe(count);
      expect(azzertions.tester.test.failures.length).toBe(failures.length);
      failures.forEach(function(failure, index) {
        expect(assertions.tester.test.failures[index]).toBe(failure);
      });
    }

    describe('__test', () => {
      it('should pass when passing', () => {
        const result = assertions.__test(true, 'is', true, () => {
          return true === true;
        });
        assertTester(result, assertions, 1, []);
      });

      it('should add to failures when fail', () => {
        const result = assertions.__test(true, 'is', false, () => {
          return true === false;
        });
        assertTester(result, assertions, 1, ['Expected <true> is <false>.']);
      });
    });

    describe('__testEquality', () => {
      it('should pass when equal', () => {
        const result = assertions.__testEquality(true, true);
        assertTester(result, assertions, 1, []);
      });

      it('should add to failures when not equal', () => {
        const result = assertions.__testEquality(true, false);
        assertTester(result, assertions, 1, ['Expected <true> to be <false>.']);
      });
    });
  });

  describe('__failsExpectation', () => {
    it('should compare against a positive assertion', () => {
      expect(assertions.__failsExpectation(true)).toBe(false);
      expect(assertions.__failsExpectation(5 === 5)).toBe(false);
      expect(assertions.__failsExpectation(5 > 1)).toBe(false);

      expect(assertions.__failsExpectation(false)).toBe(true);
      expect(assertions.__failsExpectation(5 !== 5)).toBe(true);
    });

    it('should compare against a negative assertion', () => {
      assertions.positiveAssertion = false;

      expect(assertions.__failsExpectation(true)).toBe(true);
      expect(assertions.__failsExpectation(5 === 5)).toBe(true);
      expect(assertions.__failsExpectation(5 > 1)).toBe(true);

      expect(assertions.__failsExpectation(false)).toBe(false);
      expect(assertions.__failsExpectation(5 !== 5)).toBe(false);
    });
  });

  describe('__wrapUp', () => {
    it('should return to positve assertion and wrap itself in an "and"', () => {
      assertions.positiveAssertion = false;

      const firstWrapUp = assertions.__wrapUp();

      expect(firstWrapUp.and.positiveAssertion).toBe(true);
      expect(firstWrapUp.and).toBe(assertions);

      const secondWrapUp = assertions.__wrapUp();

      expect(secondWrapUp.and.positiveAssertion).toBe(true);
      expect(secondWrapUp.and).toBe(assertions);
    });
  });

  describe('not', () => {
    it('should set assertion to negative and return itself', () => {
      const not = assertions.not();

      expect(not.positiveAssertion).toBe(false);
      expect(not).toBe(assertions);
    });
  });
});