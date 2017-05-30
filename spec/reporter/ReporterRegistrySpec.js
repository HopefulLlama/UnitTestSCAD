var ReporterRegistry;

describe('ReporterRegistry', function() {
  beforeEach(function() {
    ReporterRegistry = require('../../src/reporter/ReporterRegistry');
  });

  var checkReporterExists = function(reporter) {
    expect(ReporterRegistry.reporters[reporter]).not.toBe(undefined);
  };

   var checkReporterNotExists = function(reporter) {
    expect(ReporterRegistry.reporters[reporter]).toBe(undefined);
  };

  it('should have default reporters', function() {
    ['console', 'json'].forEach(checkReporterExists);
  });

  it('should add new reporters', function() {
    ['wizzle', 'wozzle', 'woo'].forEach(function(reporter) {
      checkReporterNotExists(reporter);
      ReporterRegistry.add(reporter, function() {});
      checkReporterExists(reporter);
    });
  });
});