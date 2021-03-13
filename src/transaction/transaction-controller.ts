import { parseISO } from 'date-fns'
import { getTransactionService } from './transaction-service-instance'
import { Request, ServerRoute } from '@hapi/hapi'
import { TransactionSplit, transactionSplitSchema, transactionV2Schema } from './transaction-model'
import Joi from 'joi'

const service = getTransactionService()

export const transactionRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/transactions',
    handler: async request =>
      await (request.query.startingAt
        ? service.listTransactionsAfter(parseISO(request.query.startingAt))
        : service.listTransactions()),
    options: {
      validate: {
        query: Joi.object({
          startingAt: Joi.date().required(),
        }),
      },
      response: {
        schema: Joi.array().items(transactionV2Schema),
      },
    },
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: async request => await service.findTransactionById(parseInt(request.params.id)),
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
      },
      response: {
        schema: transactionV2Schema,
      },
    },
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
    options: {
      validate: {
        payload: Joi.object({
          version: Joi.string().required(),
          splits: Joi.array().items(transactionSplitSchema).min(1),
        }),
      },
      response: {
        schema: transactionV2Schema,
      },
    },
  },
]
