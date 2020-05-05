import { downloadTransactions } from "./transaction/download-transactions";

import { adaptTransactions } from "./transaction/adapt-transactions";
import { saveTransactions } from "./transaction/save-transactions";
import { downloadBalances } from "./balance/download-balances";
import { saveBalances } from "./balance/save-balances";
import { debug } from "../log";
import { saveRawPlaid } from "../raw-plaid/raw-plaid-repository";

export async function saveLatestTransactionsToDb() {
  debug('Transaction Download', 'start');
  const startTime = Date.now();

  const plaidTransactions = await downloadTransactions();
  await saveRawPlaid(plaidTransactions);

  const transactions = adaptTransactions(plaidTransactions);
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
  debug('Transaction Download', `finished. ${JSON.stringify(results)}`);
  results.balances = balances; // don't log balances
  return results;
}
