var fs = require('fs');
var winston = require('winston');
var xml2js = require('xml2js');

var report = function(results, options) {
	var builder = new xml2js.Builder();
	var xml = builder.buildObject(results);
  fs.writeFileSync(options.dest, xml);
  winston.info('Results written to ' + options.dest);
};

module.exports = report;