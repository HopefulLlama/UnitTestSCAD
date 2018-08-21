class E2eValues {
  constructor() {
    this.APP = 'node';
    this.TEMP_REQUIRE = './spec/e2e/temp.js';
    this.UNITTESTSCAD = './src/UnitTestScad.js';
    this.CONFIG_BASE = './spec/e2e/resources/';
    this.REDIRECT = '2>&1';
  }

  getCommandCli(config) {
    return [this.APP, this.UNITTESTSCAD, config, this.REDIRECT].join(' ');
  }

  getCommandRequire () {
    return [this.APP, this.TEMP_REQUIRE, this.REDIRECT].join(' ');
  }
}

module.exports = new E2eValues();