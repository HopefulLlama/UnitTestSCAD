const os = require('os');

function wrapInImport(prefix, directory, fileName) {
  return `${prefix} <${directory}/${fileName}>;${os.EOL}`;
}

module.exports = class {
  constructor(name, use, include) {
    this.name = name;
    this.use = use;
    this.include = include;
    this.tests = [];
  }

  getUse(directory) {
    return this.use.reduce((accumulator, use) => `${accumulator}${wrapInImport("use", directory, use)}`, '');
  }

  getInclude(directory) {
    return this.include.reduce((accumulator, include) => `${accumulator}${wrapInImport("include", directory, include)}`, '');
  }

  getHeader(directory) {
    return `${this.getUse(directory)}${this.getInclude(directory)}${os.EOL}`;
  }

  getSummary() {
    return this.tests.reduce((summary, test) => {
      summary.tests.push(test.getSummary());
      summary.assertions += test.assertions;
      summary.failures += test.failures.length;
      return summary;
    }, {
      name: this.name,
      assertions: 0,
      failures: 0,
      tests: []
    });
  }
};