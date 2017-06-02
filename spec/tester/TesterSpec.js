var os = require('os');

var Tester = require('../../src/tester/Tester');

describe('Tester', function() {
  describe('wrapWithText', function() {
    it('should wrap with text', function() {
      var echo = 'echo(';
      var semicolon = ');';

      ['a', 'b', 'c', 'd', 'e'].forEach(function(letter) {
        expect(Tester.wrapWithMarker(letter)).toEqual(
          echo + Tester.START_MARKER + semicolon + os.EOL +
          echo + letter + semicolon + os.EOL +
          echo + Tester.END_MARKER + semicolon + os.EOL +
          'cube(1);');
      });

    });
  });
});