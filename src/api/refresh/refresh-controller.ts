import { error } from '../../log'
import { saveLatestTransactionsToDb } from '../../plaid'
import { ServerRoute } from '@hapi/hapi'

export const refreshRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/refresh',
    handler: async (): Promise<unknown> => {
      try {
        return await saveLatestTransactionsToDb()
      } catch (e) {
        error('REFRESH', 'Could not refresh transactions', e)
        throw e
      }
    },
    options: {
      tags: ['api'],
    },
  },
]
