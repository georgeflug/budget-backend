import { CheckAccountResult, CheckAccountStatus } from "./check-account-result";
import { downloadTransactionsForAccount } from "../../plaid/transaction/download-transactions";
import { getLinkToken } from "../../plaid/link-tokens";
import { BankAccount, bankAccounts } from "../../plaid/bankAccounts";

export function checkAccounts(): Promise<CheckAccountResult[]> {
  return Promise.all(bankAccounts.map(account => checkAccount(account)));
}

async function checkAccount(account: BankAccount): Promise<CheckAccountResult> {
  const status = await getAccountStatus(account);
  return {
    accountName: account.name,
    linkToken: status == CheckAccountStatus.NeedsLogin ? (await getLinkToken(account)) : '',
    status
  };
}

async function getAccountStatus(account: BankAccount): Promise<CheckAccountStatus> {
  try {
    await downloadTransactionsForAccount(account, new Date());
    return CheckAccountStatus.Connected;
  } catch (e) {
    if (e.error_code === 'ITEM_LOGIN_REQUIRED') {
      return CheckAccountStatus.NeedsLogin;
    } else {
      return CheckAccountStatus.UnknownError;
    }
  }
}
