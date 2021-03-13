import { checkAccounts } from './check-accounts-service'
import { ServerRoute } from '@hapi/hapi'

export const checkAccountConnectivityRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/check-account-connectivity',
    handler: async () => await checkAccounts(),
  },
]
