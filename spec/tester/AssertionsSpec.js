var Assertions = require('../../src/tester/Assertions');

var assertions;

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