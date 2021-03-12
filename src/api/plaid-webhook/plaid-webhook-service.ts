import { PlaidTransactionWebhookCode, PlaidWebhookBody, PlaidWebhookType } from './plaid-webhook-model'
import { saveLatestTransactionsToDb } from '../../plaid'

export async function processIncomingWebhook(body: PlaidWebhookBody): Promise<void> {
  if (body.webhook_type === PlaidWebhookType.Transaction) {
    if (body.webhook_code === PlaidTransactionWebhookCode.DefaultUpdate) {
      await processUpdatedTransaction()
    }
  }
}

async function processUpdatedTransaction() {
  // just trigger our regular download process, because PLAID recommends you just download the past 500 transactions when the webhook is triggered
  await saveLatestTransactionsToDb()
}
