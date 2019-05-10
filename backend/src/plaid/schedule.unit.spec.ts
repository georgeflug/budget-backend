// temporary code to have typescript recognize this file as a module
export { };

const expect = require('chai').expect;
const downloader = require('./index');
const scheduler = require('./schedule');
const moment = require('moment');

var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Schedule', () => {
  const MILLIS_PER_HOUR = 1000 * 60 * 60;

  const originalDownloadMethod = downloader.saveLatestTransactionsToDb;
  const originalSetTimeout = setTimeout;

  let setTimeoutFunctions: any[] = [];
  let setTimeoutMillis: any[] = [];
  let downloadTransactionCount = 0;
  const scheduleLater = function (func, millis) {
    setTimeoutFunctions.push(func);
    setTimeoutMillis.push(millis);
  };

  beforeEach(function () {
    downloader.saveLatestTransactionsToDb = async function () {
      downloadTransactionCount += 1;
    };
  });

  afterEach(function () {
    downloader.saveLatestTransactionsToDb = originalDownloadMethod;
    setTimeoutFunctions = [];
    setTimeoutMillis = [];
  })

  it('sets the initial run at 6:00 pm today when started before 6:00 pm', async () => {
    const todayBefore6 = moment().hour(17).minute(0).second(0).millisecond(0);

    scheduler.startScheduler(() => todayBefore6.clone(), scheduleLater);

    expect(setTimeoutMillis.length).to.equal(1);
    expect(setTimeoutMillis[0]).to.equal(MILLIS_PER_HOUR);
  });

  it('sets the initial run at 6:00 pm tomorrow when started after 6:00 pm', async () => {
    const todayAfter6 = moment().hour(19).minute(0).second(0).millisecond(0);

    scheduler.startScheduler(() => todayAfter6.clone(), scheduleLater);

    expect(setTimeoutMillis.length).to.equal(1);
    expect(setTimeoutMillis[0]).to.equal(MILLIS_PER_HOUR * 23);
  });

  it('downloads the transactions when the scheduler runs', async () => {
    const todayBefore6 = moment().hour(17).minute(0).second(0).millisecond(0);

    scheduler.startScheduler(() => todayBefore6.clone(), scheduleLater);
    expect(downloadTransactionCount).to.equal(0);

    setTimeoutFunctions[0]();
    expect(downloadTransactionCount).to.equal(1);
  });

  it('sets the second run at 6:00 pm tomorrow', async () => {
    const todayBefore6 = moment().hour(17).minute(0).second(0).millisecond(0);

    scheduler.startScheduler(() => todayBefore6.clone(), scheduleLater);
    await setTimeoutFunctions[0]();

    expect(setTimeoutMillis.length).to.equal(2);
    expect(setTimeoutMillis[1]).to.equal(MILLIS_PER_HOUR * 25);
  });

});
