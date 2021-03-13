import * as Path from 'path'
import { ServerRoute } from '@hapi/hapi'

export const staticFileRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../../../budget-web/dist'),
        redirectToSlash: true,
      },
    },
  },
]
