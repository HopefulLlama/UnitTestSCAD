var fs = require('fs');
var execSync = require('child_process').execSync;

function ScadHandler() {};

ScadHandler.prototype.writeScadFile = function(scadDirectory, filePath, testText) {
	contents = global.currentTestSuite.getHeader(scadDirectory);
	contents += "\n";
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
module.exports = new ScadHandler();