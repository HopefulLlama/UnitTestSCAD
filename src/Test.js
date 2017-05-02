function Test(title) {
	this.title = title;
	this.assertions = 0;
	this.failures = 0;
	global.currentTest = this;
}

module.exports = Test;