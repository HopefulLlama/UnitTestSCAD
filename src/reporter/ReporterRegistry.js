var path = require('path');

var ConsoleReporter = require('./ConsoleReporter');
var FileHandler = require('../util/FileHandler');
var JsonReporter = require('./JsonReporter');
var Reporter = require('./Reporter');
var XmlReporter = require('./XmlReporter');

function ReporterRegistry() {
  this.reporters = {};

  this.add('console', ConsoleReporter);
  this.add('json', JsonReporter);
  this.add('xml', XmlReporter);
}

ReporterRegistry.prototype.__addCustomReporters = function(files) {
  FileHandler.executeNodeFiles(files);
};

ReporterRegistry.prototype.add = function(name, report) {
  this.reporters[name] = new Reporter(name, report);
  return this;
};

module.exports = new ReporterRegistry();