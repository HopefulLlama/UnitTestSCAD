var execSync = require('child_process').execSync;

var E2eValues = require('./E2eValues');

function E2eUtils() {}

E2eUtils.prototype.execute = function(config) {
  return execSync(E2eValues.getCommand(config));
};

module.exports = new E2eUtils();