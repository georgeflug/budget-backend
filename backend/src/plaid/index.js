const downloadTransactions = require('./download-transactions');
const adaptTransactions = require('./adapt-transactions');
const saveTransactions = require('./save-transactions');

module.exports = async function saveLatestTransactionsToDb() {
  const plaidTransactions = await downloadTransactions();
  const transactions = await adaptTransactions(plaidTransactions);
  return await saveTransactions(transactions);
};
