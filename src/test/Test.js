function Test(title, testSuite) {
	this.title = title;
	this.assertions = 0;
	this.failures = [];

	this.testSuite = testSuite;
}

module.exports = Test;