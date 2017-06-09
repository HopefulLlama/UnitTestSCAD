var os = require('os');

function TestSuite(name, use, include) {
  this.name = name;
  this.use = use;
  this.include = include;
  this.tests = [];
}

function wrapInImport(prefix, directory, fileName) {
  return prefix + " <" + directory + "/" + fileName + ">;" + os.EOL;
}

TestSuite.prototype.getHeader = function(directory) {
  var contents = "";
  this.use.forEach(function(u) {
    contents += wrapInImport("use", directory, u);
  });
  this.include.forEach(function(i) {
    contents += wrapInImport("include", directory, i);
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