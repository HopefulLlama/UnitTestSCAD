const FileHandler = require('../util/FileHandler');

class TestRunner {
  constructor() {
    this.testSuites = [];
    this.current = {
      testSuite: null,
      test: null
    };
  }

  runTests(testFiles) {
    FileHandler.executeNodeFiles(testFiles);
  }

  aggregateResults() {
    return this.testSuites.reduce((results, testSuite) => {
      const summary = testSuite.getSummary();
      results.testSuites.push(summary);
      results.assertions += summary.assertions;
      results.failures += summary.failures;
      return results;
    }, {
      assertions: 0,
      failures: 0,
      testSuites: []
    });
  }

  report(reporters) {
    const results = this.aggregateResults();
    reporters.forEach(reporter => global.ReporterRegistry.reporters[reporter.name].report(results, reporter.options));
  }
}

module.exports = new TestRunner();