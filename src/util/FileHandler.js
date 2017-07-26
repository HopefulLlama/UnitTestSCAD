var execSync = require('child_process').execSync;
var fs = require('fs');
var os = require('os');
var path = require('path');
var winston = require('winston');

function FileHandler() {
  var _this = this;
  ['scad', 'stl', 'svg'].forEach(function(format) {
    _this[format] = ['UnitTestSCAD', '48967', 'TEMP', 'DELETE-ME', format.toUpperCase()].join('_') + '.' + format;
  });
}

FileHandler.prototype.executeNodeFiles = function(files) {
  files.forEach(function(file) {
    try {
      require(path.resolve(file));
    } catch(error) {
      winston.error('ERROR: Unexpected exception occurred in file: ' + file);
      throw error;
    }
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
  try {
    return execSync(COMMAND).toString();
  } catch(commandError) {
    winston.error([
      'ERROR: Found an error compiling OpenSCAD command given.',
      'See below for output.',
      '',
      'Begin OpenSCAD output',
      commandError.stdout.toString(),
      'End OpenSCAD output',
      ''
    ].join(os.EOL));
    throw commandError;
  }
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