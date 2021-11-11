import { getBalances } from './balance-service'
import { parseISO } from 'date-fns'
import { Request, ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { Balance, balanceSchema } from './balance-model'

export const balanceRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/balances',
    handler: async (request: Request): Promise<Balance[]> => {
      const startDate = request.query.startingAt ? parseISO(request.query.startingAt) : undefined
      return await getBalances(startDate)
    },
    options: {
      tags: ['api'],
      validate: {
        query: Joi.object({
          startingAt: Joi.date().required(),
        }),
      },
      response: {
        schema: Joi.array().items(balanceSchema).label('Balance List'),
      },
    },
  },
]
