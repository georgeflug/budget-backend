// temporary code to have typescript recognize this file as a module
export {};

const plaidClient = require('./client');
const moment = require('moment');

module.exports = async function downloadTransactions() {
  const discoverTransactions = await getTransactions(process.env.DISCOVER_ACCESS_KEY, 10);
  const fccuTransactions = await getTransactions(process.env.FCCU_ACCESS_KEY, 10);
  return discoverTransactions.transactions.concat(fccuTransactions.transactions);
};

function getTransactions(accessKey, numberOfDays) {
  const startDate = moment().subtract(numberOfDays, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  return plaidClient.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  });
}