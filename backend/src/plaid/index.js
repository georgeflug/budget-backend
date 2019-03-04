const downloadTransactions = require('./download-transactions');
const adaptTransactions = require('./adapt-transactions');
const saveTransactions = require('./save-transactions');
const log = require('../log');

module.exports = async function saveLatestTransactionsToDb() {
  log.debug('Transaction Download', 'start');
  const startTime = Date.now();

  const plaidTransactions = await downloadTransactions();
  const transactions = await adaptTransactions(plaidTransactions);
  const results = await saveTransactions(transactions);

  const endTime = Date.now();
  results.duration = ((endTime - startTime) / 1000) + " seconds"
  log.debug('Transaction Download', `finished. ${JSON.stringify(results)}`);
  return results;
};
