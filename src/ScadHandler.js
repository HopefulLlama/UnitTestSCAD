var fs = require('fs');
var os = require('os');
var execSync = require('child_process').execSync;

function ScadHandler() {};

ScadHandler.prototype.writeScadFile = function(scadDirectory, filePath, testText) {
	contents = global.currentTestSuite.getHeader(scadDirectory);
	contents += os.EOL;
	contents += testText;
	fs.writeFileSync(filePath, contents);
};

ScadHandler.prototype.execTemp = function(stlFile, outputFile) {
	var COMMAND = 'openscad -o ' + stlFile + ' ' + outputFile;
	var output;
	try {
		output = execSync(COMMAND);
	} catch(a) {
		output = a.stdout.toString();
	} finally {
		return output;
	}
};

ScadHandler.prototype.getOutputLine = function(output) {
	var marker = output.find(function(line) {
		return line.search(new RegExp('UnitTestSCAD')) > 0;
	});

	return output[output.indexOf(marker) + 1];
};

ScadHandler.prototype.countVertices = function(contents) {
	contents = contents.split(os.EOL);
	contents = contents.filter(function(line) {
		return line.match(/vertex([ ]{1}[0-9]*){3}/);
	});
	contents = contents.filter(function(value, index, self) {
		return self.indexOf(value) === index;
	});
	return contents.length;
};
module.exports = new ScadHandler();