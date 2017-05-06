function Tester(testText, test, assertions) {
  this.testText = testText;
  this.test = test;

  this.output = '';

  assertions.tester = this;
  this.assertions = assertions;
};

module.exports = Tester;