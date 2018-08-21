const os = require('os');
const winston = require('winston');

const TERMINAL = require('../constants/Terminal');

module.exports = results => {
  results.testSuites.forEach(testSuiteSummary => {
    winston.info(`${testSuiteSummary.name}: `);

    testSuiteSummary.tests.forEach(testSummary => {
      winston.info(`${TERMINAL.TAB}${testSummary.name}: `);
      let summary = TERMINAL.TAB.repeat(2);
      if(testSummary.failures.length === 0) {
        summary += TERMINAL.GREEN;
      } else {
        summary += TERMINAL.RED;
      }
      summary += `${testSummary.failures.length} failures${TERMINAL.RESET} in ${testSummary.assertions} assertions.`;
      winston.info(summary);

      if(testSummary.failures.length > 0) {
        winston.info(TERMINAL.TAB.repeat(2) + testSummary.failures.join(os.EOL + TERMINAL.TAB.repeat(2)));
      }
    });
  });

  winston.info();

  let summary = '';
  if(results.failures === 0) {
    summary += TERMINAL.GREEN;
  } else {
    summary += TERMINAL.RED;
  }
  summary += `${results.failures} total failures${TERMINAL.RESET} in ${results.assertions} total assertions.`;
  winston.info(summary);
};