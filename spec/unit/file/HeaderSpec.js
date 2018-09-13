const {EOL} = require('os');

const {getHeader} = require('../../../src/file/Header');

const mocks = ['a', 'b', 'c'];
const uses = mocks.map(mock => `uses-${mock}`);
const includes = mocks.map(mock => `includes-${mock}`);
const directory = 'mockDirectory';

describe('HeaderSpec', () => {
  describe('getHeader', () => {
    describe('use', () => {
      it('should generate uses', () => {
        const header = getHeader('', uses, []);

        expect(header).toBe([
          'use <uses-a>;',
          'use <uses-b>;',
          'use <uses-c>;',
          EOL,
        ].join(EOL));
      });

      it('should generate uses with route', () => {
        const header = getHeader(directory, uses, []);

        expect(header).toBe([
          'use <mockDirectory/uses-a>;',
          'use <mockDirectory/uses-b>;',
          'use <mockDirectory/uses-c>;',
          EOL,
        ].join(EOL));
      });
    });

    describe('include', () => {
      it('should generate includes', () => {
        const header = getHeader('', [], includes);

        expect(header).toBe([
          'include <includes-a>;',
          'include <includes-b>;',
          'include <includes-c>;',
          EOL,
        ].join(EOL));
      });

      it('should generate includes with route', () => {
        const header = getHeader(directory, [], includes);

        expect(header).toBe([
          'include <mockDirectory/includes-a>;',
          'include <mockDirectory/includes-b>;',
          'include <mockDirectory/includes-c>;',
          EOL,
        ].join(EOL));
      });
    });

    describe('use and include', () => {
      it('should generate uses and includes', () => {
        const header = getHeader('', uses, includes);

        expect(header).toBe([
          'use <uses-a>;',
          'use <uses-b>;',
          'use <uses-c>;',
          'include <includes-a>;',
          'include <includes-b>;',
          'include <includes-c>;',
          EOL,
        ].join(EOL));
      });

      it('should generate uses and includes with route', () => {
        const header = getHeader(directory, uses, includes);

        expect(header).toBe([
          'use <mockDirectory/uses-a>;',
          'use <mockDirectory/uses-b>;',
          'use <mockDirectory/uses-c>;',
          'include <mockDirectory/includes-a>;',
          'include <mockDirectory/includes-b>;',
          'include <mockDirectory/includes-c>;',
          EOL,
        ].join(EOL));
      });
    });
  });

});
