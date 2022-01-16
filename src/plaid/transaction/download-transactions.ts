import { PlaidTransaction, PlaidTransactionResponse } from '../plaid-types'

import { getPlaidClient } from '../client'
import { BankAccount, bankAccounts } from '../bankAccounts'
import _ from 'lodash'
import { getTransactionService } from '../../transaction/transaction-service-instance'
import moment from 'moment'
import { ACCOUNT_MAP } from './adapt-transactions'

export async function downloadTransactions(): Promise<PlaidTransaction[]> {
  const transactionService = getTransactionService()
  const transactions = await transactionService.listTransactions()

  const downloadAllTransactions = bankAccounts.map(account => {
    const subAccountNames = account.accounts.map(subAccount => ACCOUNT_MAP[subAccount])
    const mostRecentPostedDate =
      _.chain(transactions)
        .filter(transaction => subAccountNames.includes(transaction.account))
        .map(transaction => transaction.postedDate)
        .max()
        .value() || new Date()

    return downloadTransactionsForAccount(account, mostRecentPostedDate)
  })

  const allAccounts = await Promise.all(downloadAllTransactions)
  return allAccounts.flat()
}

export async function downloadTransactionsForAccount(
  account: BankAccount,
  mostRecentPostedDate: Date,
): Promise<PlaidTransaction[]> {
  const startDate = moment(mostRecentPostedDate).subtract(15, 'days').format('YYYY-MM-DD')
  const endDate = moment().format('YYYY-MM-DD')

  const transactionResult = ((await getPlaidClient().getTransactions(account.accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  })) as unknown) as PlaidTransactionResponse

  if (transactionResult.transactions.length === 250) {
    throw new Error('Too many records retrieved from Plaid. Manual intervention required')
  }

  return transactionResult.transactions
}
