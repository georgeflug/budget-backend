export type PlaidWebhookBody = {
  webhook_type: PlaidWebhookType,
} & PlaidTransactionWebhookBody

export type PlaidTransactionWebhookBody = {
  webhook_code: PlaidTransactionWebhookCode,
  item_id: string, // BankAccount.accessKey e.g. DISCOVER_ACCESS_KEY or FCCU_ACCESS_KEY
  error: string,
  new_transactions: number  // not present during TRANSACTIONS_REMOVED
  removed_transactions: string[] // only present during TRANSACTIONS_REMOVED
}

export enum PlaidWebhookType {
  Auth = 'AUTH',                  // when a microdeposit is verified
  Transaction = 'TRANSACTIONS',   // when transactions are available
  Item = 'ITEM',                  // when Item changes (e.g. credentials no longer valid)
  Income = 'INCOME',              // income for a business?
  Asset = 'ASSETS',               // when requested reports about an Item are ready
  Holdings = 'HOLDINGS',          // when investments change
}

export enum PlaidTransactionWebhookCode {
  InitialUpdate = 'INITIAL_UPDATE',               // when the first transactions are retrieved on a new Item
  HistoricalUpdate = 'HISTORICAL_UPDATE',         // when the historical transactions are retrieved on a new Item
  DefaultUpdate = 'DEFAULT_UPDATE',               // when new transactions are posted to an Item
  TransactionsRemoved = 'TRANSACTIONS_REMOVED',   // when pending transactions are removed from an Item
}
