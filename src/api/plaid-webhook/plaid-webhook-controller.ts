import express from 'express'
import { processIncomingWebhook } from './plaid-webhook-service'

export const router = express.Router()

router.route('/plaid-webhook').post(function (req, res) {
  // return 200 immediately
  res.status(200).json({ status: 'ok' })

  // call the service in the background so that the 200 is sent
  setImmediate(() => processIncomingWebhook(req.body))
})
