import { plaidClient } from "../client";
import { UnsavedBalance } from "../../balance/balance-model";
import { bankAccounts } from "../bankAccounts";

export async function downloadBalances(): Promise<UnsavedBalance[]> {
  const downloadAllBalances = bankAccounts.map(account => getBalance(account.accessKey));
  const allBalances = await Promise.all(downloadAllBalances);
  return allBalances.flat();
}

async function getBalance(accessKey): Promise<UnsavedBalance[]> {
  const balances = await plaidClient.getBalance(accessKey);
  const accounts = balances.accounts;
  return accounts.map(account => {
    return {
      accountId: account.account_id,
      amount: account.balances.current!,
      name: account.name!
    };
  });
}
