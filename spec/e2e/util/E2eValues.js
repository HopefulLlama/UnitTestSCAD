function E2eValues() {
	this.APP = 'node';
  this.UNITTESTSCAD = './src/UnitTestScad.js';
  this.CONFIG_BASE = './spec/e2e/resources/';
}

E2eValues.prototype.getCommand = function(config) {
	return [this.APP, this.UNITTESTSCAD, config, '2>&1'].join(' ');
};

module.exports = new E2eValues();