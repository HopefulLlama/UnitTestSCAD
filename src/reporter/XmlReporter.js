const fs = require('fs');
const winston = require('winston');
const xml2js = require('xml2js');

module.exports = (results, options) => {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(results);
  fs.writeFileSync(options.dest, xml);
  winston.info('Results written to ' + options.dest);
};