const fs = require('fs');

const XmlReporter = require('../../../src/reporter/XmlReporter');

describe('XmlReporter', () => {
  it('should write a XML file', () => {
    const report = {
      'Yolo': 'Swag',
      'MoneyMoney': 'Yeah'
    };

    const options = {
      'dest': './XmlReporterSpec.xml'
    };

    XmlReporter(report, options);

    if(fs.existsSync(options.dest)) {
      const contents = fs.readFileSync(options.dest, 'utf8');
      expect(contents).toContain('<Yolo>Swag</Yolo>');
      expect(contents).toContain('<MoneyMoney>Yeah</MoneyMoney>');

      fs.unlinkSync(options.dest);
    } else {
      fail('File not written.');
    }
  });
});