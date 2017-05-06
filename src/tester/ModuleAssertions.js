var fs = require('fs');

var ScadHandler = require('../util/ScadHandler');

function ModuleAssertions() {
  this.tester = null;
};

ModuleAssertions.prototype.stlFileToBe = function(file) {
  this.tester.test.assertions++;
  var expected = fs.readFileSync(file, 'utf8');

  if(this.parent.output !== expected) {
    this.test.failures++;
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveVertexCountOf = function(expectedCount) {
  this.tester.test.assertions++;
  if(ScadHandler.countVertices(this.tester.output) !== expectedCount) {
    this.tester.test.failures++;
  }

  return {
    'and': this
  };
};

ModuleAssertions.prototype.toHaveTriangleCountOf = function(expectedCount) {
	this.tester.test.assertions++;
	if(ScadHandler.countTriangles(this.tester.output) !== expectedCount) {
		this.tester.test.failures++;
	}

	return {
		'and': this
	};
};

module.exports = ModuleAssertions;