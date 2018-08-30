const {getHeader} = require('../file/Header');

function valueOrDefault(object, property, defaultValue) {
  return (object !== undefined && object[property] !== undefined) ? object[property] : defaultValue;
}

function sanitise(options) {
  return {
    openSCADDirectory: valueOrDefault(options, 'openSCADDirectory', ''),
    use: valueOrDefault(options, 'use', []),
    include: valueOrDefault(options, 'include', []),
    setUpText: valueOrDefault(options, 'setUpText', ''),
    testText: valueOrDefault(options, 'testText', ''),
  };
}

module.exports = class {
  constructor(dirtyOptions, fileType) {
    const options = sanitise(dirtyOptions);
    const header = getHeader(options.openSCADDirectory, options.use, options.include);
    this.output = fileType.execute(header, options.setUpText, options.testText);
  }
};