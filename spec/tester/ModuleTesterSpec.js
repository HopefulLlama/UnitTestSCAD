var fs = require('fs');

var ModuleTester = require('../../src/tester/ModuleTester');

describe('ModuleTester', function() {
	describe('generateOutput', function() {
		var TEST;
		beforeEach(function() {
			TEST = {
				'testSuite': {
					'getHeader': function() {
						return '';
					}
				}
			};
		});

		it('should store the output of the generated STL', function() {
			var PATH = 'spec/resources/shouldstoretheoutputofthegeneratedSTL';
			var tester = new ModuleTester('cube([5, 5, 5])', TEST);
			tester.generateOutput('', PATH + '.scad', PATH + '.stl');

			var expectedOutput = fs.readFileSync('spec/resources/cube.stl', 'utf8');

			expect(tester.output).toBe(expectedOutput);

			try {
				fs.unlink(PATH + '.scad');
				fs.unlink(PATH + '.stl');
			} catch (e) {

			}
		});
	});
});