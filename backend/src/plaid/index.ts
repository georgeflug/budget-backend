// temporary code to have typescript recognize this file as a module
export { };

import { downloadTransactions } from './download-transactions';
import { saveRawTransactions } from './save-raw-transactions';

import { adaptTransactions } from './adapt-transactions';
import { saveTransactions } from './save-transactions';
import { downloadBalances } from './download-balances';
import { saveBalances } from './save-balances';
const log = require('../log');

async function saveLatestTransactionsToDb() {
  log.debug('Transaction Download', 'start');
  const startTime = Date.now();

  const plaidTransactions = await downloadTransactions();
  await saveRawTransactions(plaidTransactions);

  const transactions = await adaptTransactions(plaidTransactions);
  const results: any = await saveTransactions(transactions);

  const transactionDownloadedTime = Date.now();
  const balances = await downloadBalances();
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

