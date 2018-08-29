module.exports = class {
  constructor (name, testSuite) {
    this.name = name;
    this.assertions = 0;
    this.failures = [];

    this.testSuite = testSuite;
  }

  getSummary() {
    return {
      name: this.name,
      assertions: this.assertions,
      failures: this.failures
    };
  }
};