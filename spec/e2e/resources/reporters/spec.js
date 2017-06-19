testSuite('reporters', {
	'use': [],
	'include': []
}, function() {
	it('should add reporters correctly', function() {
		assert.openScadModule('cube(1);')
		.toHaveVertexCountOf(8);
	});
});