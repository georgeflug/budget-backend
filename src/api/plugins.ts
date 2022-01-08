import { staticFilePlugins } from './static-files'
import { ServerRegisterPluginObject } from '@hapi/hapi'
import { swaggerPlugins } from './swagger'
import { errorLoggingPlugin } from './error-logging'

export const plugins: ServerRegisterPluginObject<unknown>[] = [
  staticFilePlugins,
  swaggerPlugins,
  [errorLoggingPlugin],
].flat()
