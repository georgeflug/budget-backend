// temporary code to have typescript recognize this file as a module
export {};

const downloadTransactions = require('./download-transactions');
const adaptTransactions = require('./adapt-transactions');
const saveTransactions = require('./save-transactions');
const getBalances = require('./download-balances');
const saveBalances = require('./save-balances');
const log = require('../log');

async function saveLatestTransactionsToDb() {
  log.debug('Transaction Download', 'start');
  const startTime = Date.now();

  const plaidTransactions = await downloadTransactions();
  const transactions = await adaptTransactions(plaidTransactions);
  const results = await saveTransactions(transactions);

  const transactionDownloadedTime = Date.now();
  const balances = await getBalances();
  await saveBalances(balances);

  const endTime = Date.now();
  results.duration = {
    total: ((endTime - startTime) / 1000) + ' seconds',
    transactions: ((transactionDownloadedTime - startTime) / 1000) + ' seconds',
    balance: ((endTime - transactionDownloadedTime) / 1000) + ' seconds'
  };
  log.debug('Transaction Download', `finished. ${JSON.stringify(results)}`);
  results.balances = balances; // don't log balances
  return results;
};

module.exports = {
  saveLatestTransactionsToDb: saveLatestTransactionsToDb
}

