testSuite('pass', {
  use: [],
  include: []
}, function() {
  it('should pass', function() {
    assert.openScadModule('cube(1);')
    .stlFileToBe('e2e.stl')
    .and.toHaveVertexCountOf(8)
    .and.toHaveTriangleCountOf(12)
    .and.toBeWithinBoundingBox([[0, 0, 0], [1, 1, 1]])
    .and.widthToBe(1)
    .and.heightToBe(1)
    .and.depthToBe(1)
    .and.not().toHaveVertexCountOf(1)
    .and.not().toHaveTriangleCountOf(3)
    .and.not().toBeWithinBoundingBox([[0, 0, 0], [0, 0, 0]])
    .and.not().widthToBe(2)
    .and.not().heightToBe(2)
    .and.not().depthToBe(2);
  });

  it('openScad2DModule', function() {
		assert.withSetup('translate([5, 5]) { square([1, 1]); }')
		.openScad2DModule('square([1, 1]);')
		.svgFileToBe('e2e.svg')
		.and.heightToBe(6)
		.and.widthToBe(6)
		.and.toHaveVertexCountOf(8)
		.and.toBeWithinBoundingBox([[0, -6], [6, 0]])
		.and.not().heightToBe(7)
		.and.not().widthToBe(7)
		.and.not().toHaveVertexCountOf(9)
		.and.not().toBeWithinBoundingBox([[0, 0], [0, 0]]);
  });
});