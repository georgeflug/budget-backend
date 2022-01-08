import { debug } from '../log'
import { routes } from './routes'
import { Server } from '@hapi/hapi'
import { plugins } from './plugins'
import { config } from '../util/config'

export async function initServer(): Promise<void> {
  const server = new Server({
    host: 'localhost',
    port: config.port,
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          console.error(err)
          throw err
        },
      },
    },
  })
  await server.register(plugins)
  server.route(routes)
  await server.start()
  debug('Startup', `Listening on localhost:${server.info.port}`)
}
