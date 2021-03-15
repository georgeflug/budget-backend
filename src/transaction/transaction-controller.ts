import { parseISO } from 'date-fns'
import { getTransactionService } from './transaction-service-instance'
import { Request, ServerRoute } from '@hapi/hapi'
import { TransactionSplit, transactionSplitListSchema, transactionV2Schema } from './transaction-model'
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
      tags: ['api'],
      validate: {
        query: Joi.object({
          startingAt: Joi.date().required(),
        }),
      },
      response: {
        schema: Joi.array().items(transactionV2Schema).label('Transaction List'),
      },
    },
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: async request => await service.findTransactionById(parseInt(request.params.id)),
    options: {
      tags: ['api'],
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
      tags: ['api'],
      validate: {
        payload: Joi.object({
          version: Joi.string().required(),
          splits: transactionSplitListSchema,
        }).label('Transaction Update'),
      },
      response: {
        schema: transactionV2Schema,
      },
    },
  },
]
