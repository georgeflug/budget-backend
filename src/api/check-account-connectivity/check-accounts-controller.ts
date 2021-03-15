import { checkAccounts } from './check-accounts-service'
import Joi from 'joi'
import { checkAccountResultSchema } from './check-account-result'
import { ServerRoute } from '@hapi/hapi'

export const checkAccountConnectivityRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/check-account-connectivity',
    handler: async () => await checkAccounts(),
    options: {
      tags: ['api'],
      response: {
        schema: Joi.array().items(checkAccountResultSchema).label('Check Account Connectivity List'),
      },
    },
  },
]
