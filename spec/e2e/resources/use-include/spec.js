testSuite('use', {
  'use': ['AddOne.scad'],
  'include': []
}, function() {
  it('should add one', function() {
    assert.openScadFunction('AddOne(1);')
    .outputToBe('2')
    .and.not().outputToBe('3');
  });
});

testSuite('include', {
  'use': [],
  'include': ['AddOne.scad']
}, function() {
  it('should have a value', function() {
    assert.openScadFunction('five;')
    .outputToBe('5');
  });
});