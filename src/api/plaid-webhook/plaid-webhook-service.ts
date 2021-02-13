import { PlaidTransactionWebhookBody, PlaidTransactionWebhookCode, PlaidWebhookBody, PlaidWebhookType } from "./plaid-webhook-model";
import { saveLatestTransactionsToDb } from "../../plaid";

export async function processIncomingWebhook(body: PlaidWebhookBody) {
  if (body.webhook_type === PlaidWebhookType.Transaction) {
    if (body.webhook_code === PlaidTransactionWebhookCode.DefaultUpdate) {
      await processUpdatedTransaction(body)
    }
  }
}

async function processUpdatedTransaction(body: PlaidTransactionWebhookBody) {
  // just trigger our regular download process, because PLAID recommends you just download the past 500 transactions when the webhook is triggered
  await saveLatestTransactionsToDb()
}
