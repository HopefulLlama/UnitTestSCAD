var os = require('os');

var Test = require('../../src/test/Test');

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
      expect(test.getSummary()).toBe('Mock Test Suite: Test:' + os.EOL + '    0 failures in 5 assertions.' + os.EOL);
    });

    it('should report more detail if there are failures', function() {
      test.assertions = 7;
      test.failures = ['Swag', 'Yolo', 'Honeybadger'];

      expect(test.getSummary()).toBe('Mock Test Suite: Test:' + os.EOL + '    3 failures in 7 assertions.' + os.EOL +
        '    Swag' + os.EOL +
        '    Yolo' + os.EOL +
        '    Honeybadger' + os.EOL);
    });
  });
});