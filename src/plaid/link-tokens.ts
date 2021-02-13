import { plaidClient } from './client';
import {BankAccount} from "./bankAccounts";

export async function getLinkToken(account: BankAccount): Promise<string> {
  const response = await plaidClient.createPublicToken(account.accessKey);
  return response.public_token;
}
