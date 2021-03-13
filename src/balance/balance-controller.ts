import { getBalances } from './balance-service'
import { parseISO } from 'date-fns'
import { Request, ServerRoute } from '@hapi/hapi'

export const balanceRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/balances',
    handler: async (request: Request): Promise<unknown> => {
      const startDate = request.query.startingAt ? parseISO(request.query.startingAt) : undefined
      return await getBalances(startDate)
    },
  },
]
