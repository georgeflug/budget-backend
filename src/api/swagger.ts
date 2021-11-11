import inert from '@hapi/inert'
import vision from '@hapi/vision'
import * as HapiSwagger from 'hapi-swagger'
import { ServerRegisterPluginObject } from '@hapi/hapi'

export const swaggerPlugins: ServerRegisterPluginObject<any>[] = [
  {
    plugin: inert,
  },
  {
    plugin: vision,
  },
  {
    plugin: HapiSwagger,
    options: {
      info: {
        title: 'Budget Backend Documentation',
        version: '1.0',
      },
    },
  },
]
