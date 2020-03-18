import {PlaidTransactionResponse, PlaidTransaction} from "../plaid-types";

import {plaidClient} from '../client';
import {BankAccount, bankAccounts} from "../bankAccounts";

const moment = require('moment');

export async function downloadTransactions(): Promise<PlaidTransaction[]> {
  const downloadAllTransactions = bankAccounts.map(account => downloadTransactionsForAccount(account, 30));
  const allAccounts = await Promise.all(downloadAllTransactions);
  return allAccounts.flat();
}

export function downloadTransactionsForAccount(account: BankAccount, numberOfDays: number): Promise<PlaidTransaction[]> {
  return getTransactions(account.accessKey, numberOfDays);
}

async function getTransactions(accessKey, numberOfDays): Promise<PlaidTransaction[]> {
  const startDate = moment().subtract(numberOfDays, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  const transactionResult = await plaidClient.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  }) as any as PlaidTransactionResponse;

  return transactionResult.transactions;
}
