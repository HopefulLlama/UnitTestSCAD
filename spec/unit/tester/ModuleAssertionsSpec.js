const os = require('os');
const ModuleAssertions = require('../../../src/tester/ModuleAssertions');

describe('ModuleAssertions', () => {
  let moduleAssertions, OUTPUT;

  const FILE = 'spec/unit/resources/garbage.stl';

  const STL_FILE = 'stlFileToBe';
  const VERTEX_COUNT = 'toHaveVertexCountOf';
  const TRIANGLE_COUNT = 'toHaveTriangleCountOf';
  const BOUNDING_BOX = 'toBeWithinBoundingBox';
  const WIDTH = 'widthToBe';
  const HEIGHT = 'heightToBe';
  const DEPTH = 'depthToBe';
  const CONTAINING_VERTICES = 'toContainVertices';
  const EXACT_VERTICES = 'toHaveExactVertices';

  function generateTester(output) {
    return {
      output,
      test: {
        assertions: 0,
        failures: []
      }
    };
  }

  function assertAssertionsAndFailures(assertions, failures) {
    expect(moduleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
    expect(moduleAssertions.tester.test.failures.length).toBe(failures, 'failures');
  }

  function assert(func, expectation, assertions, failures) {
    expect(moduleAssertions[func](expectation)).toEqual({and: moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNot(func, expectation, assertions, failures) {
    expect(moduleAssertions.not()[func](expectation)).toEqual({and: moduleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  class TestCase {
    constructor(func, pass, fail, passAsString, conjunction, failAsString) {
      this.func = func;
      this.pass = pass;
      this.fail = fail;

      this.passAsString = (passAsString !== undefined) ? passAsString : pass;
      this.conjunction = (conjunction !== undefined) ? conjunction : 'to be';
      this.failAsString = (failAsString !== undefined) ? failAsString : fail;
    }

    doTests() {
      it(`${this.func} should pass`, () => assert(this.func, this.pass, 1, 0));

      it(`${this.func} should fail`, () => {
        assert(this.func, this.fail, 1, 1);
        expect(moduleAssertions.tester.test.failures[0]).toBe(`Expected <${this.passAsString}> ${this.conjunction} <${this.failAsString}>.`);
      });

      it(`not ${this.func} should pass`, () => assertNot(this.func, this.fail, 1, 0));

      it(`not ${this.func} should fail`, () => {
        assertNot(this.func, this.pass, 1, 1);
        expect(moduleAssertions.tester.test.failures[0]).toBe(`Expected <${this.passAsString}> not ${this.conjunction} <${this.passAsString}>.`);
      });
    }
  }

  function BoundsTestCase(testee, expectedString) {
    this.testee = testee;
    this.expectedString = expectedString;
  }

  describe('test GetVertices', () => {
    beforeEach(() => {
      OUTPUT = [
        'vertex 0 0 0',
        'vertex 1 2 3',
        'vertex 1.1 2.2 3.3',
        'vertex 11.11 22.22 33.33',
        'vertex 11.1111 22.222222 33.33333'
      ].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    describe('should get the correct number of vertices', () => {
      const testCase = new TestCase(VERTEX_COUNT, 5, 6);
      testCase.doTests();
    });
  });


  describe('with test file output', () => {
    const actualAsString = '[[0, 0, 0], [3, 0, 3], [3, 3, 3]]';
    beforeEach(() => {
      OUTPUT = [
        'garbage',
        'vertex 0 0 0',
        'vertex 3 0 3',
        'endfacet',
        'endfacet',
        'vertex 3 3 3'
      ].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should fail to compare STL files', () => {
      for (let i = 1; i <= 3; i++) {
        assert(STL_FILE, FILE, i, i);
        expect(moduleAssertions.tester.test.failures[i-1]).toBe('Expected <' + moduleAssertions.tester.output + '> to be <garbage>.');
      }
    });

    it('should pass on not STL files', () => {
      for (let i = 1; i <= 3; i++) {
        assertNot(STL_FILE, FILE, i, 0);
      }
    });

    [
      new TestCase(VERTEX_COUNT, 3, 5),
      new TestCase(TRIANGLE_COUNT, 2, 5),
      new TestCase(CONTAINING_VERTICES, [
        [0, 0, 0],
        [3, 0, 3],
        [3, 3, 3]
      ], [
        [4, 5, 6]
      ], '[[0, 0, 0], [3, 0, 3], [3, 3, 3]]', 'to contain all vertices in', '[[4, 5, 6]]'),
      new TestCase(EXACT_VERTICES, [
        [0, 0, 0],
        [3, 0, 3],
        [3, 3, 3]
      ], [
        [0, 0, 0],
        [3, 0, 3]
      ], '[[0, 0, 0], [3, 0, 3], [3, 3, 3]]', 'to have exactly all vertices in', '[[0, 0, 0], [3, 0, 3]]')
    ].forEach(testCase => testCase.doTests());

    it('should correctly be within bounds', () => assert(BOUNDING_BOX, [[0, 0, 0], [3, 3, 3]], 1, 0));

    it('should fail not if within bounds', () => {
      const expected = [[0, 0, 0], [3, 3, 3]];
      const expectedAsString = '[[0, 0, 0], [3, 3, 3]]';
      assertNot(BOUNDING_BOX, expected, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe(`Expected <${actualAsString}> not to be within the bounds of <${expectedAsString}>.`);
    });

    it('should pass if any point is outside the bounds', () => {
      [
        [[1, 0, 0], [3, 3, 3]],
        [[0, 1, 0], [3, 3, 3]],
        [[0, 0, 1], [3, 3, 3]],
        [[0, 0, 0], [2, 3, 3]],
        [[0, 0, 0], [3, 2, 3]],
        [[0, 0, 0], [3, 3, 2]]
      ].forEach((testCase, index) => assertNot(BOUNDING_BOX, testCase, index+1, 0));
    });

    it('should fail if any point is outside the bounds', () => {
      [
        new BoundsTestCase([[1, 0, 0], [3, 3, 3]], '[[1, 0, 0], [3, 3, 3]]'),
        new BoundsTestCase([[0, 1, 0], [3, 3, 3]], '[[0, 1, 0], [3, 3, 3]]'),
        new BoundsTestCase([[0, 0, 1], [3, 3, 3]], '[[0, 0, 1], [3, 3, 3]]'),
        new BoundsTestCase([[0, 0, 0], [2, 3, 3]], '[[0, 0, 0], [2, 3, 3]]'),
        new BoundsTestCase([[0, 0, 0], [3, 2, 3]], '[[0, 0, 0], [3, 2, 3]]'),
        new BoundsTestCase([[0, 0, 0], [3, 3, 2]], '[[0, 0, 0], [3, 3, 2]]')
      ].forEach((testCase, index) =>{
        assert(BOUNDING_BOX, testCase.testee, index+1, index+1);
        expect(moduleAssertions.tester.test.failures[index]).toBe(`Expected <${actualAsString}> to be within the bounds of <${testCase.expectedString}>.`);
      });
    });
  });

  describe('with different file output', () => {
    beforeEach(() => {
      OUTPUT = ['vertex 0 0 0', 'vertex 3 0 3', 'vertex 4 5 6'].join(os.EOL);

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    [
      new TestCase(WIDTH, 4, 10),
      new TestCase(HEIGHT, 5, 10),
      new TestCase(DEPTH, 6, 10)
    ].forEach(testCase => testCase.doTests());
  });

  describe('with mock file output', () => {
    beforeEach(() => {
      OUTPUT = 'garbage';

      moduleAssertions = new ModuleAssertions();
      moduleAssertions.tester = generateTester(OUTPUT);
    });

    it('should compare stl successfully', () => assert(STL_FILE, FILE, 1, 0));

    it('should fail stl not comparison', () => {
      assertNot(STL_FILE, FILE, 1, 1);
      expect(moduleAssertions.tester.test.failures[0]).toBe(`Expected <${moduleAssertions.tester.output}> not to be <garbage>.`);
    });
  });
});