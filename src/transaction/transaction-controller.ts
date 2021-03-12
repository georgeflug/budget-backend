import { parseISO } from 'date-fns'
import { getTransactionService } from './transaction-service-instance'
import { Route } from '../api/route'
import express from 'express'

const router = express.Router()

const service = getTransactionService()

router.route('/').get(async function (req, res) {
  const results = await (req.query.startingAt
    ? service.listTransactionsAfter(parseISO(req.query.startingAt))
    : service.listTransactions())
  res.json(results)
})

router
  .route('/:id')
  .get(async function (req, res) {
    const result = await service.findTransactionById(parseInt(req.params.id))
    res.json(result)
  })
  .put(async function (req, res) {
    const result = await service.updateTransactionSplits(
      parseInt(req.params.id),
      parseInt(req.body.version),
      req.body.splits,
    )
    res.json(result)
  })

export const transactionRoute: Route = {
  router,
  basePath: '/transactions',
}
