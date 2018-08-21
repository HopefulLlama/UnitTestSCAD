let testRunner;

describe('TestRunner', () => {
  beforeEach(() => {
    testRunner = require('../../../src/test/TestRunner');
  });

  describe('runTests', () => {
    it('should change directory and run all tests as "required"', () => {

    });
  });

  describe('aggregateResults', () => {
    it('should get the summary of all tests', () => {
      function mockTestSuite(assertions, failures) {
        return {
          'assertions': assertions,
          'failures': failures,
          'getSummary': () => {
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

      testRunner.testSuites.forEach(testSuite => spyOn(testSuite, 'getSummary').and.callThrough());

      const results = testRunner.aggregateResults();
      expect(results.assertions).toBe(131);
      expect(results.failures).toBe(67);

      testRunner.testSuites.forEach(testSuite => expect(testSuite.getSummary).toHaveBeenCalled());
    });
  });


  describe('report', () => {
    const RESULTS = {};
    function MockReporter(name) {
      this.name = name;
      this.options = {
        'mock': true
      };
      this.report = () => {};
    }

    it('should call every reporter listed', () => {
      spyOn(testRunner, 'aggregateResults').and.callFake(() => RESULTS);

      const reporterNames = ['fake', 'mocked', 'hello'];
      const reporterArray = reporterNames.reduce((previousValue, currentValue) => {
        previousValue.push(new MockReporter(currentValue));
        return previousValue;
      }, []);

      global.ReporterRegistry = {
        'reporters': reporterNames.reduce((previousValue, currentValue) => {
          previousValue[currentValue] = new MockReporter(currentValue);
          return previousValue;
        }, {})
      };

      reporterNames.forEach(reporter => spyOn(global.ReporterRegistry.reporters[reporter], 'report').and.stub());

      testRunner.report(reporterArray);

      expect(testRunner.aggregateResults).toHaveBeenCalled();
      reporterNames.forEach(reporter => {
        const testee = global.ReporterRegistry.reporters[reporter];
        expect(testee.report).toHaveBeenCalledWith(RESULTS, testee.options);
      });
    });
  });
});