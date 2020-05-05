import {plaidClient} from '../client';
import {Balance} from "../../balance/balance-model";
import {bankAccounts} from "../bankAccounts";

const moment = require('moment');

export async function downloadBalances(): Promise<Balance[]> {
  const downloadAllBalances = bankAccounts.map(account => getBalance(account.accessKey));
  const allBalances = await Promise.all(downloadAllBalances);
  return allBalances.flat();
}

async function getBalance(accessKey): Promise<Balance[]> {
  const balances = await plaidClient.getBalance(accessKey);
  const accounts = balances.accounts;
  return accounts.map(account => {
    return {
      accountId: account.account_id,
      balance: account.balances.current!,
      date: moment(),
      name: account.name!
    };
  });
}
