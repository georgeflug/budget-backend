// temporary code to have typescript recognize this file as a module
export { };

const moment = require('moment');
const downloader = require('./index');
const log = require('../log');

const TIME_OF_DAY_TO_RUN_IT = 18;

function startScheduler(getCurrentMoment = moment, scheduleLater = setTimeout) {
  const today = getCurrentMoment();
  if (today.hour() < TIME_OF_DAY_TO_RUN_IT) {
    scheduleNextExecution(today);
  } else {
    const tomorrow = today.add(1, 'days');
    scheduleNextExecution(tomorrow);
  }

  function scheduleNextExecution(day) {
    const scheduledTime = day.hour(TIME_OF_DAY_TO_RUN_IT).minute(0).second(0);
    const millisFromNow = scheduledTime.diff(getCurrentMoment());

    scheduleLater(async function () {
      log.debug('SCHEDULER', 'Beginning scheduled download');
      try {
        await downloader.saveLatestTransactionsToDb();
        log.debug('SCHEDULER', 'Finished scheduled download');
      } catch (ex) {
        log.error('SCHEDULER', 'Failed to download transactions', ex);
      }
      scheduleNextExecution(day.add(1, 'days'));
    }, millisFromNow);
  }
}

module.exports = {
  startScheduler: startScheduler
}