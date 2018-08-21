const execSync = require('child_process').execSync;

const E2eValues = require('./E2eValues');

module.exports = {
  executeCli(config) {
    return execSync(E2eValues.getCommandCli(config));
  },
  executeRequire(config) {
    return execSync(E2eValues.getCommandRequire());
  }
};