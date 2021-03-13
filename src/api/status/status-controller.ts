import { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'

export const statusRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/status',
    handler: () => ({ status: 'OK' }),
    options: {
      response: {
        schema: Joi.object({
          status: Joi.string(),
        }),
      },
    },
  },
]
