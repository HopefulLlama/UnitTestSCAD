var execSync = require('child_process').execSync;
var fs = require('fs');
var os = require('os');
var path = require('path');

function FileHandler() {
  var _this = this;
  ['scad', 'stl', 'svg'].forEach(function(format) {
    _this[format] = ['UnitTestSCAD', '48967', 'TEMP', 'DELETE-ME', format.toUpperCase()].join('_') + '.' + format;
  });
}

FileHandler.prototype.executeNodeFiles = function(files) {
  files.forEach(function(file) {
    require(path.resolve(file));
  });
};

FileHandler.prototype.writeScadFile = function(header, setUpText, testText) {
  contents = header + os.EOL;
  if(setUpText !== null) {
    contents += setUpText + os.EOL;
  }
  contents += testText;
  fs.writeFileSync(this.scad, contents);
};

FileHandler.prototype.convert = function(destination) {
  var COMMAND = 'openscad -o ' + destination + ' ' + this.scad;
  return execSync(COMMAND).toString();
};

FileHandler.prototype.convertToStl = function() {
  return this.convert(this.stl);
};

FileHandler.prototype.convertToSvg = function() {
  return this.convert(this.svg);
};

FileHandler.prototype.getStlConversionOutput = FileHandler.prototype.convertToStl;
FileHandler.prototype.getStlContent = function() {
  this.convertToStl();
  return fs.readFileSync(this.stl, 'utf8');
};
FileHandler.prototype.getSvgContent = function() {
  this.convertToSvg();
  return fs.readFileSync(this.svg, 'utf8');
};

FileHandler.prototype.cleanUp = function() {
  [this.scad, this.stl, this.svg].forEach(function(file) {
    if(fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};

module.exports = new FileHandler();