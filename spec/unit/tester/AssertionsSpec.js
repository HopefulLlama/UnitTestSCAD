var Assertions = require('../../../src/tester/Assertions');

var assertions;
function getNewTester() {
  return {
    'test': {
      'assertions': 0,
      'failures': []
    }
  };
}

describe('Assertions', function() {
  beforeEach(function() {
    assertions = new Assertions();
  });

  describe('__buildFailureMessage', function() {
    it('should create a failure message', function() {
      expect(assertions.__buildFailureMessage(5, 'to be', 1)).toBe('Expected <5> to be <1>.');
      expect(assertions.__buildFailureMessage('abc', 'wubl', 'asdsad')).toBe('Expected <abc> wubl <asdsad>.');
      expect(assertions.__buildFailureMessage(true, 'a', false)).toBe('Expected <true> a <false>.');

      assertions.positiveAssertion = false;
      expect(assertions.__buildFailureMessage(5, 'to be', 5)).toBe('Expected <5> not to be <5>.');
    });
  });

  describe('with tester', function() {
    beforeEach(function() {
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

    describe('__test', function() {
      it('should pass when passing', function() {
        var result = assertions.__test(true, 'is', true, function() {
          return true === true;
        });
        assertTester(result, assertions, 1, []);
      });

      it('should add to failures when fail', function() {
        var result = assertions.__test(true, 'is', false, function() {
          return true === false;
        });
        assertTester(result, assertions, 1, ['Expected <true> is <false>.']);
      });
    });

    describe('__testEquality', function() {
      it('should pass when equal', function() {
        var result = assertions.__testEquality(true, true);
        assertTester(result, assertions, 1, []);
      });

      it('should add to failures when not equal', function() {
        var result = assertions.__testEquality(true, false);
        assertTester(result, assertions, 1, ['Expected <true> to be <false>.']);
      });
    });
  });

  describe('__failsExpectation', function() {
    it('should compare against a positive assertion', function() {
      expect(assertions.__failsExpectation(true)).toBe(false);
      expect(assertions.__failsExpectation(5 === 5)).toBe(false);
      expect(assertions.__failsExpectation(5 > 1)).toBe(false);

      expect(assertions.__failsExpectation(false)).toBe(true);
      expect(assertions.__failsExpectation(5 !== 5)).toBe(true);
    });

    it('should compare against a negative assertion', function() {
      assertions.positiveAssertion = false;

      expect(assertions.__failsExpectation(true)).toBe(true);
      expect(assertions.__failsExpectation(5 === 5)).toBe(true);
      expect(assertions.__failsExpectation(5 > 1)).toBe(true);

      expect(assertions.__failsExpectation(false)).toBe(false);
      expect(assertions.__failsExpectation(5 !== 5)).toBe(false);
    });
  });

  describe('__wrapUp', function() {
    it('should return to positve assertion and wrap itself in an "and"', function() {
      assertions.positiveAssertion = false;

      var wrapUp = assertions.__wrapUp();

      expect(wrapUp.and.positiveAssertion).toBe(true);
      expect(wrapUp.and).toBe(assertions);

      wrapUp = assertions.__wrapUp();

      expect(wrapUp.and.positiveAssertion).toBe(true);
      expect(wrapUp.and).toBe(assertions);
    });
  });

  describe('not', function() {
    it('should set assertion to negative and return itself', function() {
      var not = assertions.not();

      expect(not.positiveAssertion).toBe(false);
      expect(not).toBe(assertions);
    });
  });
});