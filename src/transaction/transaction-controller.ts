import { parseISO } from 'date-fns'
import { getTransactionService } from './transaction-service-instance'
import { Request, ServerRoute } from '@hapi/hapi'
import { TransactionSplit } from './transaction-model'

const service = getTransactionService()

export const transactionRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/transactions',
    handler: async request =>
      await (request.query.startingAt
        ? service.listTransactionsAfter(parseISO(request.query.startingAt))
        : service.listTransactions()),
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: async request => await service.findTransactionById(parseInt(request.params.id)),
  },
  {
    method: 'PUT',
    path: '/transactions/{id}',
    handler: async (request: Request): Promise<unknown> => {
      const payload = request.payload as { version: string; splits: TransactionSplit[] }
      return await service.updateTransactionSplits(
        parseInt(request.params.id),
        parseInt(payload.version),
        payload.splits,
      )
    },
  },
]
