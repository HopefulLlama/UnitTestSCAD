function genericThingToString(thing) {
  if(Array.isArray(thing)) {
    return thing.reduce((accumulator, element, index) => {
      accumulator += genericThingToString(element);
      if(index !== thing.length - 1) {
        accumulator += ', ';
      }
      return accumulator;
    }, '[') + ']';
  } else if (thing === null) {
    return 'null';
  } else if (thing === undefined) {
    return 'undefined';
  } else {
    return thing.toString();
  }
}

module.exports = genericThingToString;