const {EOL} = require('os');

const proxyquire = require('proxyquire');

const options = {
  header: 'header',
  setUpText: 'setUpText',
  testText: 'testText'
};

// scadFile comes directly from File.js
const scadFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_SCAD.scad';

const tempDirectory = 'temp';
const output = 'output';
const error = 'error';

let mockChildProcess, mockFs, File;

describe('FileSpec', () => {
  beforeEach(() => {
    mockChildProcess = jasmine.createSpyObj('mockChildProcess', [
      'execSync'
    ]);

    mockFs = jasmine.createSpyObj('mockFs', [
      'writeFileSync',
      'readFileSync',
      'existsSync',
      'unlinkSync'
    ]);

    File = proxyquire('../../../src/file/File', {
      'child_process': mockChildProcess,
      'fs': mockFs,
    });
  });

  describe('openscad executes successfully', () => {
    beforeEach(() => {
      mockFs.readFileSync.and.returnValue(output);
      mockChildProcess.execSync.and.returnValue({
        toString: jasmine.createSpy()
      });
    });

    describe('and file exists', () => {
      beforeEach(() => mockFs.existsSync.and.returnValue(true));

      it('should write the file, execute, clean up and return the output', () => {
        const output = File.execute(options, tempDirectory);

        expect(output).toBe(output);
        expect(mockChildProcess.execSync).toHaveBeenCalledWith(`openscad -o ${tempDirectory} ${scadFile}`);
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(scadFile, `${options.header}${EOL}${options.setUpText}${EOL}${options.testText}`);
        expect(mockFs.readFileSync).toHaveBeenCalledWith(tempDirectory, 'utf-8');
        expect(mockFs.existsSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.existsSync).toHaveBeenCalledWith(scadFile);
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(scadFile);
      });
    });

    describe('and file does not exist', () => {
      beforeEach(() => mockFs.existsSync.and.returnValue(false));

      it('should write the file, execute, NOT clean up and return the output', () => {
        const output = File.execute(options, tempDirectory);

        expect(output).toBe(output);
        expect(mockChildProcess.execSync).toHaveBeenCalledWith(`openscad -o ${tempDirectory} ${scadFile}`);
        expect(mockFs.writeFileSync).toHaveBeenCalledWith(scadFile, `${options.header}${EOL}${options.setUpText}${EOL}${options.testText}`);
        expect(mockFs.readFileSync).toHaveBeenCalledWith(tempDirectory, 'utf-8');
        expect(mockFs.existsSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.existsSync).toHaveBeenCalledWith(scadFile);
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
      });
    });
  });

  describe('openscad fails to execute', () => {
    beforeEach(() => mockChildProcess.execSync.and.throwError(error));

    describe('and file exists', () => {
      beforeEach(() => mockFs.existsSync.and.returnValue(true));

      it('should clean up and throw error', () => {
        expect(() => File.execute(options, tempDirectory)).toThrowError(error);
        expect(mockFs.existsSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.existsSync).toHaveBeenCalledWith(scadFile);
        expect(mockFs.unlinkSync).toHaveBeenCalledWith(scadFile);
      });
    });

    describe('and file does not exist', () => {
      beforeEach(() => mockFs.existsSync.and.returnValue(false));

      it('should clean up and throw error', () => {
        expect(() => File.execute(options, tempDirectory)).toThrowError(error);
        expect(mockFs.existsSync).toHaveBeenCalledWith(tempDirectory);
        expect(mockFs.existsSync).toHaveBeenCalledWith(scadFile);
        expect(mockFs.unlinkSync).not.toHaveBeenCalled();
      });
    });
  });
});