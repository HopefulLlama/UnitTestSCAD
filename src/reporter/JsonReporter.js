var fs = require('fs');
var winston = require('winston');

var report = function(results, options) {
  fs.writeFileSync(options.dest, JSON.stringify(results, null, '  '));
  winston.info('Results written to ' + options.dest);
};

module.exports = report;