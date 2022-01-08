import { Request, ResponseToolkit, Server, ServerRegisterPluginObject } from '@hapi/hapi'
import { Boom } from '@hapi/boom'
import { error } from '../log'

function isBoom(varToCheck: unknown): varToCheck is Boom<unknown> {
  return !!(varToCheck as Boom<unknown>).isBoom
}

export const errorLoggingPlugin: ServerRegisterPluginObject<unknown> = {
  plugin: {
    name: 'myPlugin',
    version: '1.0.0',
    register: async function (server: Server): Promise<void> {
      server.ext('onPreResponse', (request: Request, reply: ResponseToolkit): symbol => {
        if (isBoom(request.response) && request.response.isServer) {
          error('ErrorLoggingPlugin', 'Internal Server Error', request.response)
        }
        return reply.continue
      })
    },
  },
}
