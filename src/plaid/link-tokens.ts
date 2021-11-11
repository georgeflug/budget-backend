import { getPlaidClient } from './client'
import { BankAccount } from './bankAccounts'

export async function getLinkToken(account: BankAccount): Promise<string> {
  const response = await getPlaidClient().createPublicToken(account.accessKey)
  return response.public_token
}
