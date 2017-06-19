var os = require('os');

var TestSuite = require('../../../src/test/TestSuite');

describe('TestSuite', function() {
  describe('getHeader()', function() {
    var name = "getHeader";
    var use = ['Use1', 'Foo', 'Bar'];
    var include = ['Include1', 'Foil', 'Bazro'];

    var directory = 'directory';

    it('should "use" correctly', function() {
      var testSuite = new TestSuite(name, use, []);
      var header = testSuite.getHeader(directory);

      var expected = use.reduce(function(previousValue, currentValue) {
        previousValue += 'use <' + directory + '/' + currentValue + '>;' + os.EOL;
        return previousValue;
      }, '');
      expected += os.EOL;

      expect(header).toBe(expected);
    });

    it('should "include" correctly', function() {
      var testSuite = new TestSuite(name, [], include);
      var header = testSuite.getHeader(directory);

      var expected = include.reduce(function(previousValue, currentValue) {
        previousValue += 'include <' + directory + '/' + currentValue + '>;' + os.EOL;
        return previousValue;
      }, '');
      expected += os.EOL;

      expect(header).toBe(expected);
    });

    it('should "use" and "include" correctly', function() {
      var testSuite = new TestSuite(name, use, include);
      var header = testSuite.getHeader(directory);

      var expected = use.reduce(function(previousValue, currentValue) {
        previousValue += 'use <' + directory + '/' + currentValue + '>;' + os.EOL;
        return previousValue;
      }, '');
      expected = include.reduce(function(previousValue, currentValue) {
        previousValue += 'include <' + directory + '/' + currentValue + '>;' + os.EOL;
        return previousValue;
      }, expected);
      expected += os.EOL;

      expect(header).toBe(expected);
    });

    it('should rollup information in a summary', function() {
    	function mockTest(assertions, failures) {
    		return {
    			'assertions': assertions,
    			'failures': {
    				'length': failures
    			},
    			'getSummary': function() {

    			}
    		};
    	}

    	var testSuite = new TestSuite('TestSuite', [], []);
    	testSuite.tests = [
    		mockTest(5, 2),
    		mockTest(2, 2),
    		mockTest(0, 0)
    	];

    	testSuite.tests.forEach(function(test) {
    		spyOn(test, 'getSummary').and.callThrough();
    	});

    	var summary = testSuite.getSummary();

    	expect(summary.name).toBe('TestSuite');
    	expect(summary.assertions).toBe(7);
    	expect(summary.failures).toBe(4);
    	
    	testSuite.tests.forEach(function(test) {
        expect(test.getSummary).toHaveBeenCalled();
      });
    });
  });
});