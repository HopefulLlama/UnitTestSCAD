var os = require('os');

var ModuleAssertions = require('../../src/tester/ModuleAssertions');

describe('ModuleAssertions', function() {
	var moduleAssertions, TESTER, OUTPUT;

	var assertAssertionsAndFailures = function(assertions, failures) {
		expect(moduleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
		expect(moduleAssertions.tester.test.failures.length).toBe(failures, 'failures');
	};

	var assertStlFile = function(filePath, assertions, failures) {
		expect(moduleAssertions.stlFileToBe(filePath)).toEqual({'and': moduleAssertions});
		assertAssertionsAndFailures(assertions, failures);
	};

	var assertVertexCount = function(vertices, assertions, failures) {
		expect(moduleAssertions.toHaveVertexCountOf(vertices)).toEqual({'and': moduleAssertions});
		assertAssertionsAndFailures(assertions, failures);
	};

	var assertTriangleCount = function(triangles, assertions, failures) {
		expect(moduleAssertions.toHaveTriangleCountOf(triangles)).toEqual({'and': moduleAssertions});
		assertAssertionsAndFailures(assertions, failures);
	};

	var assertBoundingBox = function(bounds, assertions, failures) {
		expect(moduleAssertions.toBeWithinBoundingBox(bounds)).toEqual({'and': moduleAssertions});
		assertAssertionsAndFailures(assertions, failures);
	};

	describe('with test file output', function() {
		beforeEach(function() {
			OUTPUT = 'garbage' + os.EOL + 
			'vertex 0 0 0' + os.EOL + 
			'vertex 3 0 3' + os.EOL + 
			'endfacet' + os.EOL + 
			'endfacet' + os.EOL + 
			'vertex 3 3 3';

			TESTER = {
				'output': OUTPUT,
				'test': {
					'assertions': 0,
					'failures': []
				}
			};

			moduleAssertions = new ModuleAssertions();
			moduleAssertions.tester = TESTER;
		});

		it('should fail to compare STL files', function() {
			for (var i = 1; i <= 3; i++) {
				assertStlFile('spec/resources/garbage.stl', i, i);
				expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected "' + moduleAssertions.tester.output + '" to be "garbage".');
			}
		});

		it('should correctly count the number of vertices', function() {
			assertVertexCount(3, 1, 0);
		});

		it('should fail if the count of vertices does not match', function() {
			for(var i = 1; i <= 10; i++) {
				assertVertexCount(5, i, i);
				expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected 3 to be 5.');
			}
		});

		it('should correctly count the number of triangles', function() {
			assertTriangleCount(2, 1, 0);
		});

		it('should fail if the count of triangles does not match', function() {
			for(var i = 1; i <= 10; i++) {
				assertTriangleCount(5, i, i);
				expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected 2 to be 5.');
			}
		});

		it('should correctly be within bounds', function() {
			assertBoundingBox([[0, 0, 0], [3, 3, 3]], 1, 0);
		});

		it('should fail any point is outside the bounds', function() {
			var testCases = [
				[[1, 0, 0], [3, 3, 3]],
				[[0, 1, 0], [3, 3, 3]],
				[[0, 0, 1], [3, 3, 3]],
				[[0, 0, 0], [2, 3, 3]],
				[[0, 0, 0], [3, 2, 3]],
				[[0, 0, 0], [3, 3, 2]]
			];
			var actual = [[0, 0, 0], [3, 0, 3], [3, 3, 3]].toString();
			for(var i = 0; i < testCases.length; i++) {
				assertBoundingBox(testCases[i], i+1, i+1);
				expect(moduleAssertions.tester.test.failures[i]).toBe('Expected ' + actual + ' to be within the bounds of ' + testCases[i] + '.');
			}
		});
	});

	describe('with stl file output', function() {
		beforeEach(function() {
			OUTPUT = 'garbage';

			TESTER = {
				'output': OUTPUT,
				'test': {
					'assertions': 0,
					'failures': []
				}
			};

			moduleAssertions = new ModuleAssertions();
			moduleAssertions.tester = TESTER;
		});

		it('should compare stl successfully', function() {
			assertStlFile('spec/resources/garbage.stl', 1, 0);
		});
	});
});