import Joi from 'joi'
import { ServerRoute } from '@hapi/hapi'

export const statusRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/status',
    handler: () => ({ status: 'OK' }),
    options: {
      tags: ['api'],
      response: {
        schema: Joi.object({
          status: Joi.string(),
        }).label('Status'),
      },
    },
  },
]
