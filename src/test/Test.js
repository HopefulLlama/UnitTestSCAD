function Test(title, testSuite) {
	this.title = title;
	this.assertions = 0;
	this.failures = 0;

	this.testSuite = testSuite;
}

module.exports = Test;