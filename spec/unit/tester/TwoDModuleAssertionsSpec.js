const os = require('os');

const TwoDModuleAssertions = require('../../../src/tester/TwoDModuleAssertions');

describe('TwoDModuleAssertions', () => {
  let twoDModuleAssertions;

  const FILE = 'spec/unit/resources/garbage.svg';

  const SVG_FILE = 'svgFileToBe';
  const HEIGHT = 'heightToBe';
  const WIDTH = 'widthToBe';
  const VERTEX_COUNT = 'toHaveVertexCountOf';
  const BOUNDING_BOX = 'toBeWithinBoundingBox';
  const CONTAINING_VERTICES = 'toContainVertices';
  const EXACT_VERTICES = 'toHaveExactVertices';

  function generateTester(output, parsedOutput) {
    return {
      output,
      parsedOutput: (parsedOutput !== undefined) ? parsedOutput : {},
      test: {
        assertions: 0,
        failures: []
      }
    };
  }

  function assertAssertionsAndFailures(assertions, failures) {
    expect(twoDModuleAssertions.tester.test.assertions).toBe(assertions, 'assertions');
    expect(twoDModuleAssertions.tester.test.failures.length).toBe(failures, 'failures');
  }

  function assert(func, expectation, assertions, failures) {
    expect(twoDModuleAssertions[func](expectation)).toEqual({'and': twoDModuleAssertions});
    assertAssertionsAndFailures(assertions, failures);
  }

  function assertNot(func, expectation, assertions, failures) {
    expect(twoDModuleAssertions.not()[func](expectation)).toEqual({'and': twoDModuleAssertions});
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
        expect(twoDModuleAssertions.tester.test.failures[0]).toBe(`Expected <${this.passAsString}> ${this.conjunction} <${this.failAsString}>.`);
      });

      it(`not ${this.func} should pass`, () => assertNot(this.func, this.fail, 1, 0));

      it(`not ${this.func} should fail`, () => {
        assertNot(this.func, this.pass, 1, 1);
        expect(twoDModuleAssertions.tester.test.failures[0]).toBe(`Expected <${this.passAsString}> not ${this.conjunction} <${this.passAsString}>.`);
      });
    }
  }


  function BoundsTestCase(testee, expectedString) {
    this.testee = testee;
    this.expectedString = expectedString;
  }

  describe('with test file output', () => {
    const actual = [
      [6, 6], [5, 6], [5, 5], [6, 5],
      [1, 1], [0, 1], [0, 0], [1, 0]
    ];
    const actualAsString = '[[6, 6], [5, 6], [5, 5], [6, 5], [1, 1], [0, 1], [0, 0], [1, 0]]';

    beforeEach(() => {
      const parsedOutput = {
        $: {
          height: 10,
          width: 10
        },
        path: [{
          $: {
            d: `${os.EOL}M 6,6 L 5,6 L 5,5 L 6,5 z${os.EOL}M 1,1 L 0,1 L 0,0 L 1,0 z${os.EOL}`
          }
        }]
      };

      twoDModuleAssertions = new TwoDModuleAssertions();
      twoDModuleAssertions.tester = generateTester('not garbage', parsedOutput);
    });

    it('should fail to compare svg file', () => {
      assert(SVG_FILE, FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe(`Expected <${twoDModuleAssertions.tester.output}> to be <garbage>.`);
    });

    it('should pass svg not comparison', () => {
      assertNot(SVG_FILE, FILE, 1, 0);
    });

    [
      new TestCase(HEIGHT, 10, 20),
      new TestCase(WIDTH, 10, 20),
      new TestCase(VERTEX_COUNT, 8, 20),
      new TestCase(CONTAINING_VERTICES, actual, [[0,3]], actualAsString, 'to contain all vertices in', '[[0, 3]]'),
      new TestCase(EXACT_VERTICES, actual, [[0,3]], actualAsString, 'to have exactly all vertices in', '[[0, 3]]')
    ].forEach(testCase => testCase.doTests());

    it('should pass bounding box', () => assert(BOUNDING_BOX, [[0, 0], [6, 6]], 1, 0));

    it('should fail bounding box on any dimensions', () => {
      [
        new BoundsTestCase([[1, 0], [6, 6]], '[[1, 0], [6, 6]]'),
        new BoundsTestCase([[0, 1], [6, 6]], '[[0, 1], [6, 6]]'),
        new BoundsTestCase([[0, 0], [5, 6]], '[[0, 0], [5, 6]]'),
        new BoundsTestCase([[0, 0], [6, 5]], '[[0, 0], [6, 5]]')
      ].forEach((testCase, index) => {
        assert(BOUNDING_BOX, testCase.testee, index+1, index+1);
        expect(twoDModuleAssertions.tester.test.failures[index]).toBe('Expected <' + actualAsString + '> to be within the bounds of <' + testCase.expectedString + '>.');
      });
    });


    it('should pass not bounding box', () => assertNot(BOUNDING_BOX, [[1, 1], [5, 5]], 1, 0));

    it('should fail not bounding box', () => {
      const expected = [[0, 0], [6, 6]];
      const expectedAsString = '[[0, 0], [6, 6]]';
      assertNot(BOUNDING_BOX, expected, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe(`Expected <${actualAsString}> not to be within the bounds of <${expectedAsString}>.`);
    });
  });

  describe('with mock file output', () => {
    beforeEach(() => {
      twoDModuleAssertions = new TwoDModuleAssertions();
      twoDModuleAssertions.tester = generateTester('garbage');
    });

    it('should compare svg successfully', () => assert(SVG_FILE, FILE, 1, 0));

    it('should fail svg not comparison', () => {
      assertNot(SVG_FILE, FILE, 1, 1);
      expect(twoDModuleAssertions.tester.test.failures[0]).toBe(`Expected <${twoDModuleAssertions.tester.output}> not to be <garbage>.`);
    });
  });
});