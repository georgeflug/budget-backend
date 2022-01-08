import * as Path from 'path'
import { ServerRegisterPluginObject, ServerRoute } from '@hapi/hapi'
import inert from '@hapi/inert'

export const staticFileRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/budget-web/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '../../../budget-web/build'),
        redirectToSlash: true,
      },
    },
  },
]

export const staticFilePlugins: ServerRegisterPluginObject<any>[] = [
  {
    plugin: inert,
  },
]
