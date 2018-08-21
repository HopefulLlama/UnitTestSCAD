const execSync = require('child_process').execSync;
const fs = require('fs');
const os = require('os');
const path = require('path');
const winston = require('winston');

class FileHandler {
  constructor() {
    ['scad', 'stl', 'svg'].forEach(format => {
      this[format] = `UnitTestSCAD_48967_TEMP_DELETE-ME_${format.toUpperCase()}.${format}`;
    });
  }

  executeNodeFiles(files) {
    files.forEach(file => {
      try {
        require(path.resolve(file));
      } catch(error) {
        winston.error(`ERROR: Unexpected exception occurred in file: ${file}`);
        throw error;
      }
    });
  }

  writeScadFile(header, setUpText, testText) {
    let contents = header + os.EOL;
    if(setUpText !== null) {
      contents += setUpText + os.EOL;
    }
    contents += testText;
    fs.writeFileSync(this.scad, contents);
  }

  convert(destination) {
    const COMMAND = `openscad -o ${destination} ${this.scad}`;
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
  }

  convertToStl() {
    return this.convert(this.stl);
  }

  convertToSvg() {
    return this.convert(this.svg);
  }

  getStlConversionOutput() {
    return this.convertToStl();
  }

  getStlContent() {
    this.convertToStl();
    return fs.readFileSync(this.stl, 'utf8');
  }

  getSvgContent() {
    this.convertToSvg();
    return fs.readFileSync(this.svg, 'utf8');
  }

  cleanUp() {
    [this.scad, this.stl, this.svg].forEach(file => {
      if(fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
  }
}

module.exports = new FileHandler();