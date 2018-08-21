const os = require('os');

const Test = require('../../../src/test/Test');

const TEST_SUITE = {
  'name': 'Mock Test Suite'
};

let test;

describe('Test', () => {
  describe('getSummary', () => {
    beforeEach(() => {
      test = new Test('Test', TEST_SUITE);
    });

    it('should just report single line if no failures', () => {
      test.assertions = 5;

      const summary = test.getSummary();
      expect(summary.name).toBe('Test');
      expect(summary.assertions).toBe(5);
      expect(summary.failures).toEqual([]);
    });

    it('should report more detail if there are failures', () => {
      const failures = ['Swag', 'Yolo', 'Honeybadger'];
      test.assertions = 7;
      test.failures = failures;

      const summary = test.getSummary();
      expect(summary.name).toBe('Test');
      expect(summary.assertions).toBe(7);
      expect(summary.failures).toEqual(failures);
    });
  });
});