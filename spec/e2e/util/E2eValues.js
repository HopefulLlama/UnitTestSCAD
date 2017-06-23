function E2eValues() {
  this.APP = 'node';
  this.TEMP_REQUIRE = './spec/e2e/temp.js';
  this.UNITTESTSCAD = './src/UnitTestScad.js';
  this.CONFIG_BASE = './spec/e2e/resources/';
  this.REDIRECT = '2>&1';
}

E2eValues.prototype.getCommandCli = function(config) {
  return [this.APP, this.UNITTESTSCAD, config, this.REDIRECT].join(' ');
};

E2eValues.prototype.getCommandRequire = function() {
  return [this.APP, this.TEMP_REQUIRE, this.REDIRECT].join(' ');
};

module.exports = new E2eValues();