function TestSuite(name, use, include) {
	this.name = name;
	this.use = use;
	this.include = include;
	this.tests = [];

	global.currentTestSuite = this;
}

TestSuite.prototype.getHeader = function(directory) {
	var contents = "";
	this.use.forEach(function(u) {
		contents += "use <" + directory + "/" + u + ">;\n";
	});
	this.include.forEach(function(i) {
		contents += "include <" + directory + "/" + i + ">;\n";
	});
	contents += "\n";

	return contents;
};

module.exports = TestSuite;