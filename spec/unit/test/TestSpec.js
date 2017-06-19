var os = require('os');

var Test = require('../../../src/test/Test');

var TEST_SUITE = {
  'name': 'Mock Test Suite'
};

var test;

describe('Test', function() {
  describe('getSummary', function() {
    beforeEach(function() {
      test = new Test('Test', TEST_SUITE);
    });

    it('should just report single line if no failures', function() {
      test.assertions = 5;

      var summary = test.getSummary();
      expect(summary.name).toBe('Test');
      expect(summary.assertions).toBe(5);
      expect(summary.failures).toEqual([]);
    });

    it('should report more detail if there are failures', function() {
      var failures = ['Swag', 'Yolo', 'Honeybadger'];
      test.assertions = 7;
      test.failures = failures;

      var summary = test.getSummary();
      expect(summary.name).toBe('Test');
      expect(summary.assertions).toBe(7);
      expect(summary.failures).toEqual(failures);
    });
  });
});