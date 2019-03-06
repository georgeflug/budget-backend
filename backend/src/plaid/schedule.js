const moment = require('moment');
const downloader = require('./index');

const TIME_OF_DAY_TO_RUN_IT = 18;

function startScheduler(getCurrentMoment = moment) {
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

    setTimeout(async function () {
      await downloader.saveLatestTransactionsToDb();
      scheduleNextExecution(day.add(1, 'days'));
    }, millisFromNow);
  }
}

module.exports = {
  startScheduler: startScheduler
}