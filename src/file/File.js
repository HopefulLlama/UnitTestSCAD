const {EOL} = require('os');
const fs = require('fs');
const {execSync} = require('child_process');

const scadFile = 'UnitTestSCAD_48967_TEMP_DELETE-ME_SCAD.scad';

function writeSCADFile(header, setUpText, testText) {
  const contents = `${header}${EOL}${setUpText}${EOL}${testText}`;
  fs.writeFileSync(scadFile, contents);
}

function executeOpenSCAD(tempFile, variables) {
  const command = `openscad -o ${tempFile} ${variables.reduce((acc,item)=>" -D "+item[0]+"=\""+item[1]+acc+"\"", "")} ${scadFile}`;
  const out = execSync(command).toString();
  const file = fs.readFileSync(tempFile, 'utf-8');
  return {
    out,
    file,
  };
}

function safeUnlink(file) {
  if(fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

module.exports = {
  execute(options, tempOutput) {
    writeSCADFile(options.header, options.setUpText, options.testText);
    try {
      return executeOpenSCAD(tempOutput, options.setVariables);
    } catch(error) {
      throw error;
    } finally {
      safeUnlink(tempOutput);
      safeUnlink(scadFile);
    }
  }
};
