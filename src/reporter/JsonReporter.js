var fs = require('fs');

var report = function(results, options) {
  fs.writeFileSync(options.dest, JSON.stringify(results, null, '  '));
  console.log('Results written to ' + options.dest);
};

module.exports = report;