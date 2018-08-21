const fs = require('fs');

const JsonReporter = require('../../../src/reporter/JsonReporter');

describe('JsonReporter', () => {
  it('should write a JSON file', () => {
    const report = {
      'Yolo': 'Swag',
      'MoneyMoney': 'Yeah'
    };

    const options = {
      'dest': './JsonReporterSpec.json'
    };

    JsonReporter(report, options);

    if(fs.existsSync(options.dest)) {
      const contents = fs.readFileSync(options.dest, 'utf8');
      expect(report).toEqual(JSON.parse(contents));

      fs.unlinkSync(options.dest);
    } else {
      fail('File not written.');
    }
  });
});