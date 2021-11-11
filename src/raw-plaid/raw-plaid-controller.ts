import moment from 'moment'
import { findRawPlaidBetween } from './raw-plaid-repository'
import { Request, ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { RawPlaid, rawPlaidSchema } from './raw-plaid-model'

export const rawPlaidRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/raw-plaid',
    handler: async (request: Request): Promise<RawPlaid[]> => {
      return await findRawPlaidBetween(
        moment(request.query.date).hour(0).minute(0).second(0).toDate(),
        moment(request.query.date).hour(23).minute(59).second(59).toDate(),
      )
    },
    options: {
      tags: ['api'],
      validate: {
        query: Joi.object({
          date: Joi.date().required(),
        }),
      },
      response: {
        schema: Joi.array().items(rawPlaidSchema).label('Raw-Plaid List'),
      },
    },
  },
]
