const os = require('os');

const TestSuite = require('../../../src/test/TestSuite');

describe('TestSuite', () => {
  describe('getHeader()', () => {
    const name = "getHeader";
    const use = ['Use1', 'Foo', 'Bar'];
    const include = ['Include1', 'Foil', 'Bazro'];

    const directory = 'directory';

    function getUses() {
      return use.reduce((previousValue, currentValue) => `${previousValue}use <${directory}/${currentValue}>;${os.EOL}`, '');
    }

    function getIncludes() {
      return include.reduce((previousValue, currentValue) => `${previousValue}include <${directory}/${currentValue}>;${os.EOL}`, '');
    }

    it('should "use" correctly', () => {
      const testSuite = new TestSuite(name, use, []);
      const header = testSuite.getHeader(directory);

      const expected = `${getUses()}${os.EOL}`;

      expect(header).toBe(expected);
    });

    it('should "include" correctly', () => {
      const testSuite = new TestSuite(name, [], include);
      const header = testSuite.getHeader(directory);

      const expected = `${getIncludes()}${os.EOL}`;

      expect(header).toBe(expected);
    });

    it('should "use" and "include" correctly', () => {
      const testSuite = new TestSuite(name, use, include);
      const header = testSuite.getHeader(directory);

      const expected = `${getUses()}${getIncludes()}${os.EOL}`;

      expect(header).toBe(expected);
    });

    it('should rollup information in a summary', () => {
      function mockTest(assertions, failures) {
        return {
          'assertions': assertions,
          'failures': {
            'length': failures
          },
          'getSummary': () => {

          }
        };
      }

      const testSuite = new TestSuite('TestSuite', [], []);
      testSuite.tests = [
        mockTest(5, 2),
        mockTest(2, 2),
        mockTest(0, 0)
      ];

      testSuite.tests.forEach(test => spyOn(test, 'getSummary').and.callThrough());

      const summary = testSuite.getSummary();

      expect(summary.name).toBe('TestSuite');
      expect(summary.assertions).toBe(7);
      expect(summary.failures).toBe(4);

      testSuite.tests.forEach(test => expect(test.getSummary).toHaveBeenCalled());
    });
  });
});