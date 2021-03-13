import { debug } from '../log'
import { routes } from './routes'
import { Server } from '@hapi/hapi'
import inert from '@hapi/inert'

export async function initServer(): Promise<void> {
  const server = new Server({
    host: 'localhost',
    port: 3000,
  })
  await server.register(inert)
  server.route(routes)
  await server.start()
  debug('Startup', `Listening on localhost:${server.info.port}`)
}
