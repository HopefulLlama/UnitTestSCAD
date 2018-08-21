const fs = require('fs');
const winston = require('winston');

module.exports = function(results, options) {
  fs.writeFileSync(options.dest, JSON.stringify(results, null, '  '));
  winston.info(`Results written to ${options.dest}`);
};