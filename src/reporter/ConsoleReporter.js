var os = require('os');

var TAB = '    ';

var report = function(results) {
  results.testSuites.forEach(function(testSuiteSummary) {
    console.log(testSuiteSummary.name + ': ');

    testSuiteSummary.tests.forEach(function(testSummary) {
      console.log(TAB + testSummary.name + ': ');
      console.log(TAB.repeat(2) + testSummary.failures.length + ' failures in ' + testSummary.assertions + ' assertions.');

      if(testSummary.failures.length > 0) {
        console.log(TAB.repeat(2) + testSummary.failures.join(os.EOL + TAB.repeat(2)));
      }
    });
  });

  console.log();
  console.log(results.failures + ' total failures in ' +  results.assertions + ' total assertions.'); 
};

module.exports = report;