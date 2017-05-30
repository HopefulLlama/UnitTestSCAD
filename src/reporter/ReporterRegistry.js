var path = require('path');

var Reporter = require('./Reporter');

function ReporterRegistry() {
  this.reporters = {};

  this.add('console', require('./ConsoleReporter'));
  this.add('json', require('./JsonReporter'));
}

ReporterRegistry.prototype.__addCustomReporters = function(files) {
  files.forEach(function(file) {
    require(path.resolve(file));
  });
};

ReporterRegistry.prototype.add = function(name, report) {
  this.reporters[name] = new Reporter(name, report);
  return this;
};

module.exports = new ReporterRegistry();