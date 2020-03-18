import {downloadTransactions} from '../plaid/transaction/download-transactions';
import {adaptTransactions} from '../plaid/transaction/adapt-transactions';

const saveTransactions = require('../plaid/transaction/save-transactions');

async function doThings() {
  console.log('Connecting to DB (start docker-compose first)');
  require('../db/db').connectToDbWithRetry('localhost');
  console.log("Downloading");
  const plaidTransactions = await downloadTransactions();
  console.log("Adapting");
  const transactions = await adaptTransactions(plaidTransactions);
  console.log("Saving");
  debugger;
  const results = await saveTransactions(transactions);
  console.log("Done");
  console.log(results);
}

doThings().catch(ex => {
  console.log("Error: " + ex);
});
