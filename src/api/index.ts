import { debug, error } from '../log'
import { routes } from './routes'
import { Server } from '@hapi/hapi'
import { plugins } from './plugins'
import { config } from '../util/config'
import { saveLatestTransactionsToDb } from '../plaid'

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

  debug('Startup', 'Loading transactions')
  try {
    await saveLatestTransactionsToDb()
  } catch (e) {
    error('Startup', 'Failed to load latest transactions', e as Error)
  }
  debug('Startup', 'Latest transactions loaded')

  debug('Startup', `You may now navigate to localhost:${server.info.port}/budget-web`)
}
