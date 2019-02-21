const plaid = require('plaid');
const moment = require('moment');

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments['development'],
  {
    version: '2018-05-22'
  }
);

module.exports = async function downloadTransactions() {
  const discoverTransactions = await getTransactions(process.env.DISCOVER_ACCESS_KEY, 10);
  const fccuTransactions = await getTransactions(process.env.FCCU_ACCESS_KEY, 10);
  return discoverTransactions.transactions.concat(fccuTransactions.transactions);
};

function getTransactions(accessKey, numberOfDays) {
  const startDate = moment().subtract(numberOfDays, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  return client.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  });
}