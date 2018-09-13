const proxyquire = require('proxyquire');

const header = 'header';
const mockHeader = {
  getHeader: jasmine.createSpy('mockHeader.getHeader').and.returnValue(header)
};

const output = 'output';
const mockFileType = {
  execute: jasmine.createSpy('mockFileType.execute').and.returnValue(output)
};

const AbstractParent = proxyquire('../../../src/api/AbstractParent', {
  '../file/Header': mockHeader
});

describe('AbstractParentSpec', () => {
  describe('sanitise', () => {

    it('should call with values given', () => {
      const openSCADDirectory = 'directory';
      const use = ['a', 'b', 'c'];
      const include = ['x', 'y', 'z'];
      const setUpText = 'setUpText';
      const testText = 'testText';

      new AbstractParent({
        openSCADDirectory,
        use,
        include,
        setUpText,
        testText
      }, mockFileType);

      expect(mockHeader.getHeader).toHaveBeenCalledWith(openSCADDirectory, use, include);
      expect(mockFileType.execute).toHaveBeenCalledWith(header, setUpText, testText);
    });

    it('should use default values when not defined', () => {
      new AbstractParent({}, mockFileType);

      expect(mockHeader.getHeader).toHaveBeenCalledWith('', [], []);
      expect(mockFileType.execute).toHaveBeenCalledWith(header, '', '');
    });
  });

  describe('output', () => {
    it('should get the output from file execution', () => {
      const testee = new AbstractParent({}, mockFileType);

      expect(testee.output).toBe(output);
    });
  });
});