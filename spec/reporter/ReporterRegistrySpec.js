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

	['console', 'json', 'xml'].forEach(function(reporter) {
		it('should have default reporters: ' + reporter, function() {
			checkReporterExists(reporter);
  	});
  });

  it('should add new reporters', function() {
    ['wizzle', 'wozzle', 'woo'].forEach(function(reporter) {
      checkReporterNotExists(reporter);
      ReporterRegistry.add(reporter, function() {});
      checkReporterExists(reporter);
    });
  });
});