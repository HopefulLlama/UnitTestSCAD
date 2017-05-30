var testRunner;

describe('TestRunner', function() {
  beforeEach(function() {
    testRunner = require('../../src/test/TestRunner');
  });
  
  describe('runTests', function() {
    it('should change directory and run all tests as "required"', function() {
     
    });
  });

  describe('aggregateResults', function() {
    it('should get the summary of all tests', function() {
      function mockTestSuite(assertions, failures) {
        return {
          'assertions': assertions,
          'failures': failures,
          'getSummary': function() {
          	return {
          		'assertions': assertions,
          		'failures': failures
          	};
          }
        };
      }

      testRunner.testSuites = [
        mockTestSuite(5, 2), 
        mockTestSuite(10, 10), 
        mockTestSuite(1, 0), 
        mockTestSuite(15, 5), 
        mockTestSuite(100, 50)
      ];

      testRunner.testSuites.forEach(function(testSuite) {
        spyOn(testSuite, 'getSummary').and.callThrough();
      });

      var results = testRunner.aggregateResults();
      expect(results.assertions).toBe(131);
      expect(results.failures).toBe(67);

      testRunner.testSuites.forEach(function(testSuite) {
        expect(testSuite.getSummary).toHaveBeenCalled();
      });

    });
  });
});