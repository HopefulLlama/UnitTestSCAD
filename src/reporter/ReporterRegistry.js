const ConsoleReporter = require('./ConsoleReporter');
const FileHandler = require('../util/FileHandler');
const JsonReporter = require('./JsonReporter');
const Reporter = require('./Reporter');
const XmlReporter = require('./XmlReporter');

class ReporterRegistry {
  constructor() {
    this.reporters = {};

    this.add('console', ConsoleReporter);
    this.add('json', JsonReporter);
    this.add('xml', XmlReporter);
  }

  __addCustomReporters(files) {
    FileHandler.executeNodeFiles(files);
  }

  add(name, reporter) {
    this.reporters[name] = new Reporter(name, reporter);
    return this;
  }
}

module.exports = new ReporterRegistry();