var os = require('os');

function TestSuite(name, use, include) {
  this.name = name;
  this.use = use;
  this.include = include;
  this.tests = [];
}

TestSuite.prototype.getHeader = function(directory) {
  var contents = "";
  this.use.forEach(function(u) {
      contents += "use <" + directory + "/" + u + ">;" + os.EOL;
  });
  this.include.forEach(function(i) {
      contents += "include <" + directory + "/" + i + ">;" + os.EOL;
  });
  contents += os.EOL;

  return contents;
};

TestSuite.prototype.getSummary = function() {
  var summary = {
    'name': this.name,
    'assertions': 0,
    'failures': 0,
    'tests': []
  };

  this.tests.forEach(function(test) {
    summary.tests.push(test.getSummary());
    summary.assertions += test.assertions;
    summary.failures += test.failures.length;
  });

  return summary;
};

module.exports = TestSuite; 