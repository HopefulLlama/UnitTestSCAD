var fs = require('fs');
var xml2js = require('xml2js');

var report = function(results, options) {
	var builder = new xml2js.Builder();
	var xml = builder.buildObject(results);
  fs.writeFileSync(options.dest, xml);
  console.log('Results written to ' + options.dest);
};

module.exports = report;