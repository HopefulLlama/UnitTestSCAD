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

  it('openScadFunction', function() {
    assert.openScadFunction('"Hello"')
    .outputToBe('"Hello"')
    .and.typeToBe(OpenScadType.STRING)
    .and.not().outputToBe('"Goodbye"')
    .and.not().typeToBe(OpenScadType.NUMBER);

    function Test(setup, value, type) {
      this.setup = setup;
      this.value = value;
      this.type = type;
    }

    [
      new Test('1', '1', OpenScadType.NUMBER),
      new Test('1.5', '1.5', OpenScadType.NUMBER),
      new Test('PI', '3.14159', OpenScadType.NUMBER),
      new Test('1e200 * 1e200', 'inf', OpenScadType.INF),
      new Test('0/0', 'nan', OpenScadType.NAN),
      new Test('0/false', 'undef', OpenScadType.UNDEF),
      new Test('true', 'true', OpenScadType.BOOLEAN),
      new Test('false', 'false', OpenScadType.BOOLEAN),
      new Test('"Text"', '"Text"', OpenScadType.STRING),
      new Test('"String"', '"String"', OpenScadType.STRING),
      new Test('[0:10]', '[0 : 1 : 10]', OpenScadType.RANGE),
      new Test('[0 : 2 : 40]', '[0 : 2 : 40]', OpenScadType.RANGE),
      new Test('[0,1,2,3]', '[0, 1, 2, 3]', OpenScadType.VECTOR),
      new Test('[[0, 1], [1, 2], [2, 3]]', '[[0, 1], [1, 2], [2, 3]]', OpenScadType.VECTOR),
    ].forEach(function(test) {
      assert.withSetup('testee = ' + test.setup + ';')
      .openScadFunction('testee')
      .outputToBe(test.value)
      .and.typeToBe(test.type);
    });
  });
});