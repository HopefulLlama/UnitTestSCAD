var path = require('path');

var FileHandler = require('../util/FileHandler');

function TestRunner() {
  this.testSuites = [];
  this.current = {
    'testSuite': null,
    'test': null
  };
}

TestRunner.prototype.runTests = function(testFiles) {
  FileHandler.executeNodeFiles(testFiles);
};

TestRunner.prototype.aggregateResults = function() {
  var results = {
    'assertions': 0,
    'failures': 0,
    'testSuites': []
  };

  this.testSuites.forEach(function(testSuite) {
    var summary = testSuite.getSummary();
    results.testSuites.push(summary);
    results.assertions += summary.assertions;
    results.failures += summary.failures;
  });

  return results;
};

TestRunner.prototype.report = function(reporters) {
  var results = this.aggregateResults();

  reporters.forEach(function(reporter) {
    global.ReporterRegistry.reporters[reporter.name].report(results, reporter.options);
  });
};

module.exports = new TestRunner();