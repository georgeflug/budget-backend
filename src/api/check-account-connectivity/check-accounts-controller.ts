import { checkAccounts } from './check-accounts-service'
import { ServerRoute } from '@hapi/hapi'
import Joi from 'joi'
import { checkAccountResultSchema } from './check-account-result'

export const checkAccountConnectivityRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/check-account-connectivity',
    handler: async () => await checkAccounts(),
    options: {
      response: {
        schema: Joi.array().items(checkAccountResultSchema),
      },
    },
  },
]
