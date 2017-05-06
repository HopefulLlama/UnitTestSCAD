var FunctionAssertions = require('../../src/tester/FunctionAssertions');

describe('FunctionAssertions', function() {
	var functionAssertions, TESTER;
	describe('outputToBe', function() {
		beforeEach(function() { 
			TESTER = {
				'output': 'cat dog mouse llama hello',
				'test': {
					'assertions': 0,
					'failures': [],
				}
			};

			functionAssertions = new FunctionAssertions();
			functionAssertions.tester = TESTER;
		});

		var assertOutput = function(output, assertions, failures) {
			expect(functionAssertions.outputToBe(output)).toEqual({'and': functionAssertions});
			expect(functionAssertions.tester.test.assertions).toBe(assertions);
			expect(functionAssertions.tester.test.failures.length).toBe(failures);
		};

		it('should pass if the phrase is contained in the output', function() {
			var passingTestCases = TESTER.output.split(' ');
			for(var i = 0; i < passingTestCases.length; i++) {
				assertOutput(passingTestCases[i], i+1, 0);
			}
		});

		it('should fail if the phrase is not contained in the output', function() {
			var failingTestCases = ['lion', 'tiger', 'lynx', 'spider'];
			for(var i = 0; i < failingTestCases.length; i++) {
				assertOutput(failingTestCases[i], i+1, i+1);
				expect(functionAssertions.tester.test.failures[i]).toBe('Expected "' + functionAssertions.tester.output + '" to contain "' + failingTestCases[i] + '".');
			}			
		});
	});
});