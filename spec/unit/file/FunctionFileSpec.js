const {EOL} = require('os');

const proxyquire = require('proxyquire');

// copied from FunctionFile.js
const stlFile = `UnitTestSCAD_48967_TEMP_DELETE-ME_FUNCTION.stl`;

const startMarker = '"UnitTestSCAD __start_marker__"';
const endMarker = '"UnitTestSCAD __end_marker__"';
const failurePrevention = 'cube(1);';

const header = 'header';
const setUpText = 'setUpText';
const testText = 'testText';

const wrappedTestText = [
  `echo(${startMarker});`,
  `echo(${testText});`,
  `echo(${endMarker});`,
  failurePrevention
].join(EOL);

const mockFile = {
  execute: jasmine.createSpy('mockFile.execute').and.returnValue({
    out: `ECHO: ${startMarker}${EOL}ECHO: Poop${EOL}ECHO: Boop${EOL}ECHO: Scoop${EOL}ECHO: ${endMarker}`
  })
};

const FunctionFile = proxyquire('../../../src/file/FunctionFile', {
  './File': mockFile
});

describe('FunctionFileSpec', () => {
  it('should wrap and unwrap the text', () => {
    const output = FunctionFile.execute(header, setUpText, testText);

    // Idk why but `.toHaveBeenCalledWith()` really didn't like `wrappedTestText`'s content
    expect(mockFile.execute.calls.mostRecent().args[0].header).toBe(header);
    expect(mockFile.execute.calls.mostRecent().args[0].setUpText).toBe(setUpText);
    expect(mockFile.execute.calls.mostRecent().args[0].testText).toBe(wrappedTestText);
    expect(mockFile.execute.calls.mostRecent().args[1]).toBe(stlFile);

    expect(output).toBe(`Poop${EOL}Boop${EOL}Scoop`);
  });

  it('should sanitise wrap and unwrap the text', () => {
    const output = FunctionFile.execute(header, setUpText, testText + ';');

    expect(mockFile.execute.calls.mostRecent().args[0].header).toBe(header);
    expect(mockFile.execute.calls.mostRecent().args[0].setUpText).toBe(setUpText);
    expect(mockFile.execute.calls.mostRecent().args[0].testText).toBe(wrappedTestText);
    expect(mockFile.execute.calls.mostRecent().args[1]).toBe(stlFile);

    expect(output).toBe(`Poop${EOL}Boop${EOL}Scoop`);
  });
});