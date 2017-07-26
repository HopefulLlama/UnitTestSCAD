var os = require('os');
var winston = require('winston');

var TERMINAL = require('../constants/Terminal');

var report = function(results) {
  results.testSuites.forEach(function(testSuiteSummary) {
    winston.info(testSuiteSummary.name + ': ');

    testSuiteSummary.tests.forEach(function(testSummary) {
      winston.info(TERMINAL.TAB + testSummary.name + ': ');
      var summary = TERMINAL.TAB.repeat(2);
      if(testSummary.failures.length === 0) {
        summary += TERMINAL.GREEN;
      } else {
        summary += TERMINAL.RED;
      }
      summary += testSummary.failures.length + ' failures' + TERMINAL.RESET + ' in ' + testSummary.assertions + ' assertions.';
      winston.info(summary);

      if(testSummary.failures.length > 0) {
        winston.info(TERMINAL.TAB.repeat(2) + testSummary.failures.join(os.EOL + TERMINAL.TAB.repeat(2)));
      }
    });
  });

  winston.info();

  var summary = '';
  if(results.failures === 0) {
    summary += TERMINAL.GREEN;
  } else {
    summary += TERMINAL.RED;
  }
  summary += results.failures + ' total failures' + TERMINAL.RESET + ' in ' +  results.assertions + ' total assertions.';
  winston.info(summary); 
};

module.exports = report;