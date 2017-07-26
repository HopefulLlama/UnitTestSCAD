testSuite('fail', {
  use: [],
  include: []
}, function() {
  it('should break out with caught exception', function() {
    assert.openScadModule('covfefe(1);').toHaveVertexCountOf(0);
  });
});