var fs = require('fs');
var execSync = require('child_process').execSync;

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

var TEMP = "temp.scad";
var STL = "temp.stl";

function TestSuite(name, use, include) {
	this.name = name;
	this.use = use;
	this.include = include;
	this.tests = [];

	global.currentTestSuite = this;
}

TestSuite.prototype.getHeader = function() {
	var contents = "";
	this.use.forEach(function(u) {
		contents += "use <" + config.openScadDirectory + "/" + u + ">;\n";
	});
	this.include.forEach(function(i) {
		contents += "include <" + config.openScadDirectory + "/" + i + ">;\n";
	});
	contents += "\n";

	return contents;
};

function Test(title) {
	this.title = title;
	this.assertions = 0;
	this.failures = 0;
	global.currentTest = this;
}

global.UnitTestSCAD = [];
global.currentTestSuite = null;
global.currentTest = null;

global.testSuite = function(name, options, callback) {
	global.UnitTestSCAD.push(new TestSuite(name, options.use, options.include));
	callback();
};

global.it = function(title, callback) {
	global.currentTestSuite.tests.push(new Test(title));
	callback();
}

global.assert = {
	"openScadFunction": function(testText) {
		return {
			"outputToBe": function(expectedText) {
				writeScadFile(TEMP, 'echo("UnitTestSCAD");\necho(' + testText + ');');
				output = execTemp();
				output = output.split("\n");
				output = getOutputLine(output);

				global.currentTest.assertions++;
				if(output.search(new RegExp(regexEscape(expectedText))) < 0) {
					global.currentTest.failures++;
				}
			}
		}
	},
	"openScadModule": function(testText) {
		return {
			"stlFileToBe": function(file) {
				writeScadFile(TEMP, testText + ';');
				execTemp();

				global.currentTest.assertions++;

				var output = fs.readFileSync(STL, 'utf8');
				var expected = fs.readFileSync(file, 'utf8');

				if(output !== expected) {
					global.currentTest.failures++;
				}
				fs.unlink(STL);
			}
		}
	}
};

var writeScadFile = function(filePath, testText) {
	contents = global.currentTestSuite.getHeader();
	contents += "\n";
	contents += testText;
	fs.writeFileSync(TEMP, contents);
};

var execTemp = function() {
	var COMMAND = 'openscad -o ' + STL + ' ' + TEMP;
	var output;
	try {
		output = execSync(COMMAND);
	} catch(a) {
		output = a.stdout.toString();
	} finally {
		return output;
	}
};

var getOutputLine = function(output) {
	var marker = output.find(function(line) {
		return line.search(new RegExp('UnitTestSCAD')) > 0;
	});

	return output[output.indexOf(marker) + 1];
};

var regexEscape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

config.testFiles.forEach(function(file) {
	require(file);
});

global.UnitTestSCAD.forEach(function(testSuite) {
	testSuite.tests.forEach(function(test) {
		console.log(testSuite.name + ": " + test.title + ":\n    " + test.failures + " failures in " + test.assertions + " assertions.");
	});

	fs.unlink(TEMP);
});