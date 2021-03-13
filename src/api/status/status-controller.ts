import { ServerRoute } from '@hapi/hapi'

export const statusRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/status',
    handler: () => ({ status: 'OK' }),
  },
]
