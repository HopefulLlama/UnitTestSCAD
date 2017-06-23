var execSync = require('child_process').execSync;

var E2eValues = require('./E2eValues');

function E2eUtils() {}

E2eUtils.prototype.executeCli = function(config) {
  return execSync(E2eValues.getCommandCli(config));
};

E2eUtils.prototype.executeRequire = function(config) {
	return execSync(E2eValues.getCommandRequire());
};

module.exports = new E2eUtils();