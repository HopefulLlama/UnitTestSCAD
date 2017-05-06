var fs = require('fs');
var os = require('os');

var ScadHandler = require('../../src/util/ScadHandler');

describe('ScadHandler', function() {
	describe('writeScadFile', function() {
		it('should write a .scad file', function() {
			var PATH = './spec/resources/itshouldwriteascadfile.scad';

			var HEADER = 'use <"Fake.scad">';
			var BODY = 'cube([1, 1, 1]);';
			ScadHandler.writeScadFile(HEADER, PATH, BODY);
			
			expect(fs.existsSync(PATH)).toBe(true);
  			expect(fs.readFileSync(PATH, 'utf8')).toBe(HEADER + os.EOL + BODY);

			try {
				fs.unlink(PATH);
			} catch(e) {

			}
		});
	});

	describe('execTemp', function() {
		it('should capture the output of the scad -> stl command', function() {
			var SCAD_FILE = './spec/resources/echo.scad';
			var STL_FILE = './spec/resources/echo.stl';

			var output = ScadHandler.execTemp(STL_FILE, SCAD_FILE);
			expect(output.search(/If you can see this then it worked/) >= 0).toBe(true);
		});
	});

	describe('getOutputLine', function() {
		it('should get the line after \'UnitTestSCAD\'', function() {
			expect(ScadHandler.getOutputLine([
				'Hi',
				'UnitTestSCAD',
				'Generic'
			])).toBe('Generic');

			expect(ScadHandler.getOutputLine([
				'UnitTestSCAD',
				'Different',
				'Unique'
			])).toBe('Different');

			expect(ScadHandler.getOutputLine([
				'Alex',
				'Comma',
				'UnitTestSCAD',
				'Safety'
			])).toBe('Safety');
		});
	});

	describe('getVertices', function() {
		it('should return the vertices found in the form of \'vertex <int> <int> <int>\'', function() {
			expect(ScadHandler.getVertices(
				'hemlock' + os.EOL + 
				'clever' + os.EOL + 
				'vertex 5 4 3' + os.EOL + 
				'swag' + os.EOL + 
				'vertex 10 0 5'
			)).toEqual([[5, 4, 3], [10, 0, 5]]);
		});
	});

	describe('getTriangles', function() {
		it('should return the count of \'endfacet\' as a triangle count', function() {
			expect(ScadHandler.countTriangles(
				'cortex' + os.EOL + 
				'corrosive' + os.EOL + 
				'endfacet' + os.EOL + 
				'endfacet' + os.EOL + 
				'battalion' + os.EOL + 
				'endfacet'
			)).toEqual(3);
		});
	});
});