import { staticFilePlugins } from './static-files'
import { ServerRegisterPluginObject } from '@hapi/hapi'
import { swaggerPlugins } from './swagger'

export const plugins: ServerRegisterPluginObject<any>[] = [staticFilePlugins, swaggerPlugins].flat()
