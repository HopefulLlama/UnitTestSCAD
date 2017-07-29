function genericThingToString(thing) {
  if(Array.isArray(thing)) {
    var string = '[';
    thing.forEach(function(element, index) {
      string += genericThingToString(element);
      if(index !== thing.length - 1) {
        string += ', ';
      }
    });
    string += ']';
    return string;
  } else if (thing === null) {
    return 'null';
  } else if (thing === undefined) {
    return 'undefined';
  } else {
    return thing.toString();
  }
}

module.exports = genericThingToString;