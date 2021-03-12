import { initExpress } from './src/api'
import { startScheduler } from './src/plaid/schedule'

initExpress()
startScheduler()
