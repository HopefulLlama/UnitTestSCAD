var os = require('os');

function Test(title, testSuite) {
	this.title = title;
	this.assertions = 0;
	this.failures = [];

	this.testSuite = testSuite;
}

Test.prototype.getSummary = function() {
	var summary = this.testSuite.name + ': ' + this.title + ':' +  os.EOL + '    ' + this.failures.length + ' failures in ' + this.assertions + ' assertions.' + os.EOL;
	if(this.failures.length > 0) {
		summary += '    ' + this.failures.join(os.EOL + '    ') + os.EOL;
	}
	return summary;
};

module.exports = Test;