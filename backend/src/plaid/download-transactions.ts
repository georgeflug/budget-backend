import { PlaidTransactionResponse, PlaidTransaction } from "./plaid-types";

const plaidClient = require('./client');
const moment = require('moment');

export async function downloadTransactions(): Promise<PlaidTransaction[]> {
  const discoverTransactions = await getTransactions(process.env.DISCOVER_ACCESS_KEY, 30);
  const fccuTransactions = await getTransactions(process.env.FCCU_ACCESS_KEY, 30);
  return discoverTransactions.transactions.concat(fccuTransactions.transactions);
};

function getTransactions(accessKey, numberOfDays): PlaidTransactionResponse {
  const startDate = moment().subtract(numberOfDays, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  return plaidClient.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  });
}