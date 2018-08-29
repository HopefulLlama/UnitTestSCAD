const PrintHandler = require('../util/PrintHandler');

function isCoordinateWithinBounds(coordinate, min, max) {
  return coordinate >= min && coordinate <= max;
}

function compareArrays(actualArray, expectedArray) {
  return actualArray.every((element, index) => element === expectedArray[index]);
}

function filterNestedArrays(arrayOne, arrayTwo) {
  return arrayOne.filter(itemOne => {
    return !arrayTwo.reduce((found, itemTwo) => found || compareArrays(itemTwo, itemOne), false);
  });
}

module.exports = class {
  constructor() {
    this.tester = null;
    this.positiveAssertion = true;
  }

  __test(actual, conjunction, expected, test) {
    this.tester.test.assertions++;

    if(this.__failsExpectation(test(this))) {
      const failureMessage = this.__buildFailureMessage(actual, conjunction, expected);
      this.tester.test.failures.push(failureMessage);
    }

    return this.__wrapUp();
  }

  __testEquality(actual, expected) {
    return this.__test(actual, 'to be', expected, () => actual === expected);
  }

  __testWithinBounds(actual, expected) {
    const failingVertices = actual.reduce((previousValue, vertex) => {
      previousValue += vertex.reduce((prevValue, coordinate, index) => isCoordinateWithinBounds(coordinate, expected[0][index], expected[1][index]) ? prevValue : prevValue + 1, 0);
      return previousValue;
    }, 0);

    return this.__test(actual, 'to be within the bounds of', expected, () => failingVertices === 0);
  }

  __testAsymmetricDifference(actualArray, expectedArray) {
    const difference = filterNestedArrays(expectedArray, actualArray);
    return this.__test(actualArray, 'to contain all vertices in', expectedArray, () => difference.length === 0);
  }

  __testSymmetricDifference(actualArray, expectedArray) {
    const difference = filterNestedArrays(actualArray, expectedArray)
      .concat(filterNestedArrays(expectedArray, actualArray));
    return this.__test(actualArray, 'to have exactly all vertices in', expectedArray, () => difference.length === 0);
  }

  __buildFailureMessage(actual, conjunction, expected) {
    let message = `Expected <${PrintHandler(actual)}> `;
    if(!this.positiveAssertion) {
      message += 'not ';
    }
    message += `${conjunction} <${PrintHandler(expected)}>.`;
    return message;
  }

  __failsExpectation(condition) {
    return condition !== this.positiveAssertion;
  }

  __wrapUp() {
    this.positiveAssertion = true;
    return {
      and: this
    };
  }

  not() {
    this.positiveAssertion = false;
    return this;
  }
};