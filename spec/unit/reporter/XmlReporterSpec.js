var fs = require('fs');
var os = require('os');

var XmlReporter = require('../../../src/reporter/XmlReporter');

describe('XmlReporter', function() {
  it('should write a XML file', function() {
    var report = {
      'Yolo': 'Swag',
      'MoneyMoney': 'Yeah'
    };

    var options = {
      'dest': './XmlReporterSpec.xml'
    };

    XmlReporter(report, options);

    if(fs.existsSync(options.dest)) {
      var contents = fs.readFileSync(options.dest, 'utf8');
      expect(contents).toContain('<Yolo>Swag</Yolo>');
      expect(contents).toContain('<MoneyMoney>Yeah</MoneyMoney>');

      fs.unlinkSync(options.dest);
    } else {
      fail('File not written.');
    }
  });
});