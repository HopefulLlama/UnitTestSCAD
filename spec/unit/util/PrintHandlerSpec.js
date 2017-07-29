var PrintHandler = require('../../../src/util/PrintHandler');

function TestCase(testee, expectedResult) {
  this.testee = testee;
  this.expectedResult = expectedResult;
}

describe('PrintHandler', function() {
  [
    new TestCase('Hello', 'Hello'),
    new TestCase(123, '123'),
    new TestCase(123.45, '123.45'),
    new TestCase(true, 'true'),
    new TestCase(false, 'false'),
    new TestCase(function() {}, 'function () {}'),
    new TestCase(null, 'null'),
    new TestCase(undefined, 'undefined'),
    new TestCase([1, 2, 3], '[1, 2, 3]'),
    new TestCase([1, 2, [3, 4]], '[1, 2, [3, 4]]')
  ].forEach(function(testCase) {
    it('should do nothing to ' + testCase, function() {
      expect(PrintHandler(testCase.testee)).toBe(testCase.expectedResult);
    });
  });
});