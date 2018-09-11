const proxyquire = require('proxyquire');

// Copied from ThreeDModuleFile.js
const stlFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_THREE_D.stl';

const header = 'header';
const setUpText = 'setUpText';
const testText = 'testText';

const file = 'file';
const output = {file};
const mockFile = {
  execute: jasmine.createSpy('mockFile.execute').and.returnValue(output)
};

const ThreeDModuleFile = proxyquire('../../../src/file/ThreeDModuleFile', {
  './File': mockFile
});

describe('ThreeDModuleFileSpec', () => {
  it('should call through to File.execute', () => {
    const result = ThreeDModuleFile.execute(header, setUpText, testText);

    expect(result).toBe(file);
    expect(mockFile.execute).toHaveBeenCalledWith({
      header,
      setUpText,
      testText,
    }, stlFile);
  });
});