var fs = require('fs');
var os = require('os');
var execSync = require('child_process').execSync;

function ScadHandler() {
  this.scad = 'temp.scad';
  this.stl = 'temp.stl';
}

ScadHandler.prototype.writeScadFile = function(header, testText) {
  contents = header + os.EOL + testText;
  fs.writeFileSync(this.scad, contents);
};

ScadHandler.prototype.executeConversion = function() {
  var COMMAND = 'openscad -o ' + this.stl + ' ' + this.scad;
  return execSync(COMMAND).toString();
};

ScadHandler.prototype.getOutputLine = function(output) {
  var marker = output.find(function(line) {
    return line.search(new RegExp('UnitTestSCAD')) >= 0;
  });

  return output[output.indexOf(marker) + 1];
};

var getLinesWithVertex = function(contents) {
  return contents.split(os.EOL)
  .filter(function(line) {
    return line.match(/vertex([ ]{1}[0-9]+[.]*[0-9]*){3}/);
  });
};

ScadHandler.prototype.getVertices = function(contents) {
  return getLinesWithVertex(contents)
  .filter(function(value, index, self) {
    return self.indexOf(value) === index;
  })
  .reduce(function(accumulator, currentValue) {
    // Last three elements should be the co-ordinates, as a string
    var vertex = currentValue.split(' ')
    .slice(-3)
    .map(function(v) {
      return parseFloat(v, 10);
    });
    accumulator.push(vertex);
    return accumulator;
  }, []);
};

ScadHandler.prototype.countTriangles = function(contents) {
  return contents.split(os.EOL)
  .filter(function(line) {
    return line.match(/endfacet/);
  })
  .length;
};

ScadHandler.prototype.cleanUp = function() {
  if(fs.existsSync(this.scad)) {
    fs.unlinkSync(this.scad);
  }
  if(fs.existsSync(this.stl)) {
    fs.unlinkSync(this.stl);
  }
};

module.exports = new ScadHandler();