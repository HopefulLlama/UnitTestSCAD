var fs = require('fs');

var ScadHandler = require('../util/ScadHandler');

function FunctionAssertions() {
  this.tester = null;
}

FunctionAssertions.prototype.outputToBe = function(expectedText) {
  this.tester.test.assertions++;
  if(!stringContainsSubstring(this.tester.output, expectedText)) {
    this.tester.test.failures.push('Expected "' + this.tester.output + '" to contain "' + expectedText +'".');
  }

  return {
  	'and': this
  };
};

var regexEscape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var stringContainsSubstring = function(string, substring) {
  return string.search(new RegExp(regexEscape(substring))) >= 0;
};

module.exports = FunctionAssertions;