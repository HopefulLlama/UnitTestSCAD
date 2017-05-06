var FunctionAssertions = require('../../src/tester/FunctionAssertions');

describe('FunctionAssertions', function() {
	var functionAssertions, TESTER;
	describe('outputToBe', function() {
		beforeEach(function() { 
			TESTER = {
				'output': 'cat dog mouse llama hello',
				'test': {
					'assertions': 0,
					'failures': 0,
				}
			};

			functionAssertions = new FunctionAssertions();
			functionAssertions.tester = TESTER;
		});

		it('should pass if the phrase is contained in the output', function() {
			var passingTestCases = TESTER.output.split(' ');

			var assertions = 0;
			passingTestCases.forEach(function(p) {
				assertions++;
				expect(functionAssertions.outputToBe(p)).toEqual({'and': functionAssertions});
				expect(functionAssertions.tester.test.assertions).toBe(assertions);
				expect(functionAssertions.tester.test.failures).toBe(0);
				assertions = functionAssertions.tester.test.assertions;
			});
		});

		it('should fail if the phrase is not contained in the output', function() {
			var failingTestCases = ['lion', 'tiger', 'lynx', 'spider'];

			var assertions = 0;
			var failures = 0;

			failingTestCases.forEach(function(f) {
				assertions++;
				failures++;
				expect(functionAssertions.outputToBe(f)).toEqual({'and': functionAssertions});
				expect(functionAssertions.tester.test.assertions).toBe(assertions);
				expect(functionAssertions.tester.test.failures).toBe(failures);
				assertions = functionAssertions.tester.test.assertions;
				failures = functionAssertions.tester.test.failures;
			});
		});
	});
});