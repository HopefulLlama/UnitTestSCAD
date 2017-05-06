function TestRunner() {
	this.testSuites = [];
	this.current = {
		'testSuite': null,
		'test': null
	};
}

module.exports = TestRunner;