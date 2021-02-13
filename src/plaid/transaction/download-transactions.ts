import {PlaidTransaction, PlaidTransactionResponse} from "../plaid-types";

import {plaidClient} from '../client';
import {BankAccount, bankAccounts} from "../bankAccounts";
import _ from "lodash";
import {getTransactionService} from "../../transaction/transaction-service-instance";

const moment = require('moment');

export async function downloadTransactions(): Promise<PlaidTransaction[]> {
  const transactionService = getTransactionService();
  const transactions = await transactionService.listTransactions();
  const mostRecentPostedDate = _.chain(transactions)
    .map(transaction => transaction.postedDate)
    .max()
    .value() || new Date();

  const downloadAllTransactions = bankAccounts.map(account => downloadTransactionsForAccount(account, mostRecentPostedDate));
  const allAccounts = await Promise.all(downloadAllTransactions);
  return allAccounts.flat();
}

export async function downloadTransactionsForAccount(account: BankAccount, mostRecentPostedDate: Date): Promise<PlaidTransaction[]> {
  const startDate = moment(mostRecentPostedDate).subtract(15, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  const transactionResult = await plaidClient.getTransactions(account.accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  }) as any as PlaidTransactionResponse;

  if (transactionResult.transactions.length === 250) {
    throw new Error('Too many records retrieved from Plaid. Manual intervention required');
  }

  return transactionResult.transactions;
}