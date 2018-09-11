const proxyquire = require('proxyquire');

// Copied from TwoDModuleFile.js
const svgFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_TWO_D.svg';

const header = 'header';
const setUpText = 'setUpText';
const testText = 'testText';

const file = 'file';
const output = {file};
const mockFile = {
  execute: jasmine.createSpy('mockFile.execute').and.returnValue(output)
};

const TwoDModuleFile = proxyquire('../../../src/file/TwoDModuleFile', {
  './File': mockFile
});

describe('TwoDModuleFileSpec', () => {
  it('should call through to File.execute', () => {
    const result = TwoDModuleFile.execute(header, setUpText, testText);

    expect(result).toBe(file);
    expect(mockFile.execute).toHaveBeenCalledWith({
      header,
      setUpText,
      testText,
    }, svgFile);
  });
});