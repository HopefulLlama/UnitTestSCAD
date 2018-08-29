let ReporterRegistry;

describe('ReporterRegistry', () => {
  beforeEach(() => {
    ReporterRegistry = require('../../../src/reporter/ReporterRegistry');
  });

  function checkReporterExists(reporter) {
    expect(ReporterRegistry.reporters[reporter]).not.toBe(undefined);
  }

  function checkReporterNotExists(reporter) {
    expect(ReporterRegistry.reporters[reporter]).toBe(undefined);
  }

  ['console', 'json', 'xml'].forEach(reporter => {
    it(`should have default reporters: ${reporter}`, () => checkReporterExists(reporter));
  });

  it('should add new reporters', () => {
    ['wizzle', 'wozzle', 'woo'].forEach(reporter => {
      checkReporterNotExists(reporter);
      ReporterRegistry.add(reporter, () => {});
      checkReporterExists(reporter);
    });
  });
});