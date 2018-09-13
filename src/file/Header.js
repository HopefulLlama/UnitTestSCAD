const {EOL} = require('os');

function wrapInImport(prefix, directory, fileName) {
  const route = directory !== '' ? `${directory}/` : '';
  return `${prefix} <${route}${fileName}>;${EOL}`;
}

function getImports(imports, prefix, directory) {
  return imports.reduce((accumulator, i) => `${accumulator}${wrapInImport(prefix, directory, i)}`, '');
}

function getUses(imports, directory) {
  return getImports(imports, 'use', directory);
}

function getIncludes(imports, directory) {
  return getImports(imports, 'include', directory);
}

module.exports = {
  getHeader(directory, uses, includes) {
    return `${getUses(uses, directory)}${getIncludes(includes, directory)}${EOL}`;
  }
};