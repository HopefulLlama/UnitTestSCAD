var path = require('path');
var fs = require('fs');

function TestRunner() {
  this.config = {
    'path': '',
    'properties': {}
  };
  this.testSuites = [];
  this.current = {
    'testSuite': null,
    'test': null
  };
}

TestRunner.prototype.readConfig = function(pathToConfig) {
  this.config.path = pathToConfig;
  this.config.properties = JSON.parse(fs.readFileSync(pathToConfig, 'utf8'));
};

TestRunner.prototype.runTests = function() {
  process.chdir(path.dirname(this.config.path));

  this.config.properties.testFiles.forEach(function(file) {
    var pathToFile = path.resolve(file);
    require(pathToFile);
  });
};

TestRunner.prototype.aggregateResults = function() {
  var results = {
    'assertions': 0,
    'failures': 0,
    'summaries': []
  };

  this.testSuites.forEach(function(testSuite) {
    testSuite.tests.reduce(function(previousValue, test) {
      results.assertions += test.assertions;
      results.failures += test.failures.length;
      results.summaries.push(test.getSummary());
    }, results);
  });

  return results;
};

module.exports = new TestRunner();