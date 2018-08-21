const os = require('os');

const Tester = require('../../../src/tester/Tester');

describe('Tester', () => {
  describe('wrapWithText', () => {
    it('should wrap with text', () => {
      ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
        expect(Tester.wrapWithMarker(letter)).toEqual(
          `echo("UnitTestSCAD __start_marker__");${os.EOL}` +
          `echo(${letter});${os.EOL}` +
          `echo("UnitTestSCAD __end_marker__");${os.EOL}` +
          'cube(1);');
      });
    });
  });
});