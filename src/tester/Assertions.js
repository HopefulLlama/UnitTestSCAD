function Assertions() {
  this.tester = null;
  this.positiveAssertion = true;
}

Assertions.prototype.__test = function(actual, conjunction, expected, test) {
  this.tester.test.assertions++;

  if(this.__failsExpectation(test(this))) {
  	var failureMessage = this.__buildFailureMessage(actual, conjunction, expected);
    this.tester.test.failures.push(failureMessage);
  }

  return this.__wrapUp();
};

Assertions.prototype.__testEquality = function(actual, expected) {
	return this.__test(actual, 'to be', expected, function(dis) {
		return actual === expected;
	});
};

Assertions.prototype.__testContains = function(actual, expected) {
	return this.__test(actual, 'to contain', expected, function(dis) {
		return stringContainsSubstring(actual, expected);
	});
};

var regexEscape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

var stringContainsSubstring = function(string, substring) {
  return string.search(new RegExp(regexEscape(substring))) >= 0;
};

Assertions.prototype.__buildFailureMessage = function(actual, conjunction, expected) {
  var message = 'Expected <' + actual + '> ';
  if(!this.positiveAssertion) {
    message += 'not ';
  }
  message += conjunction + ' <' + expected + '>.';
  return message;
};

Assertions.prototype.__failsExpectation = function(condition) {
  return condition !== this.positiveAssertion;
};

Assertions.prototype.__wrapUp = function() {
  this.positiveAssertion = true;
  return {
    'and': this
  };
};

Assertions.prototype.not = function() {
  this.positiveAssertion = false;
  return this;
};

module.exports = Assertions;