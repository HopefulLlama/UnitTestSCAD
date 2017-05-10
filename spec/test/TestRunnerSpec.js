var testRunner;

describe('TestRunner', function() {
  beforeEach(function() {
    testRunner = require('../../src/test/TestRunner');
  });

  describe('readConfig', function() {
    it('should read the config', function() {
      var path = 'spec/resources/config.json';
      testRunner.readConfig(path);

      expect(testRunner.config.path).toBe(path);
      expect(testRunner.config.properties.mock).toBe('Not real');
    });
  });

  describe('runTests', function() {
    it('should change directory and run all tests as "required"', function() {
     
    });
  });

  describe('aggregateResults', function() {
    it('should get the summary of all tests', function() {
      function mockTest(assertions, failures) {
        return {
          'assertions': assertions,
          'failures': {'length': failures},
          'getSummary': function() {}
        };
      }

      testRunner.testSuites = [
        {'tests': [mockTest(5, 2), mockTest(10, 10)]}, 
        {'tests': [mockTest(1, 0), mockTest(15, 5), mockTest(100, 50)]}
      ];

      testRunner.testSuites.forEach(function(testSuite) {
        testSuite.tests.forEach(function(test) {
          spyOn(test, 'getSummary').and.stub();
        });
      });

      var results = testRunner.aggregateResults();
      expect(results.assertions).toBe(131);
      expect(results.failures).toBe(67);

      testRunner.testSuites.forEach(function(testSuite) {
        testSuite.tests.forEach(function(test) {
          expect(test.getSummary).toHaveBeenCalled();
        });
      });

    });
  });
});