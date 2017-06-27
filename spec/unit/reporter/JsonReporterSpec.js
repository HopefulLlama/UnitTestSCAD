var fs = require('fs');

var JsonReporter = require('../../../src/reporter/JsonReporter');

describe('JsonReporter', function() {
  it('should write a JSON file', function() {
    var report = {
      'Yolo': 'Swag',
      'MoneyMoney': 'Yeah'
    };

    var options = {
      'dest': './JsonReporterSpec.json'
    };

    JsonReporter(report, options);

    if(fs.existsSync(options.dest)) {
      var contents = fs.readFileSync(options.dest, 'utf8');
      expect(report).toEqual(JSON.parse(contents));

      fs.unlinkSync(options.dest);
    } else {
      fail('File not written.');
    }
  });
});