testSuite('fail', {
  use: [],
  include: []
}, function() {
  it('should fail', function() {
    assert.openScadModule('cube(1);').toHaveVertexCountOf(0);
  });
});