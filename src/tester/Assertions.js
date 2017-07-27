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


function isCoordinateWithinBounds(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
}

Assertions.prototype.__testWithinBounds = function(actual, expected) {
  var failingVertices = actual.reduce(function(previousValue, vertex) {
    previousValue += vertex.reduce(function(prevValue, coordinate, index) {
      if(!isCoordinateWithinBounds(coordinate, expected[0][index], expected[1][index])) {
        prevValue++;
      }
      return prevValue;
    }, 0);
    return previousValue;
  }, 0);

  return this.__test(actual, 'to be within the bounds of', expected, function(dis) {
    return failingVertices === 0;
  });
};

function compareArrays(actualArray, expectedArray) {
  return actualArray.every(function(element, index) {
    return element === expectedArray[index];
  });
}

function filterNestedArrays(arrayOne, arrayTwo) {
  return arrayOne.filter(function(itemOne) {
    var found = false;
    arrayTwo.forEach(function(arrayTwo) {
      found = found || compareArrays(arrayTwo, itemOne);
    });
    return !found;
  });
}

Assertions.prototype.__testAsymmetricDifference = function(actualArray, expectedArray) {
  var difference = filterNestedArrays(expectedArray, actualArray);
  return this.__test(actualArray, 'to contain all vertices in', expectedArray, function(dis) {
    return difference.length === 0;
  });
};

Assertions.prototype.__testSymmetricDifference = function(actualArray, expectedArray) {
  var difference = filterNestedArrays(actualArray, expectedArray)
  .concat(filterNestedArrays(expectedArray, actualArray));
  return this.__test(actualArray, 'to have exactly all vertices in', expectedArray, function(dis) {
    return difference.length === 0;
  });
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