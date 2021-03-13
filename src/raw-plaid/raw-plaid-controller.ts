import moment from 'moment'
import { findRawPlaidBetween } from './raw-plaid-repository'
import { Request, ServerRoute } from '@hapi/hapi'

export const rawPlaidRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/raw-plaid',
    handler: async (request: Request): Promise<unknown> => {
      if (!request.query.date) {
        return {
          error: 'date is required',
        }
      } else {
        return await findRawPlaidBetween(
          moment(request.query.date).hour(0).minute(0).second(0).toDate(),
          moment(request.query.date).hour(23).minute(59).second(59).toDate(),
        )
      }
    },
  },
]
