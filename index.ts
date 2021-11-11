import { initServer } from './src/api'
import { startScheduler } from './src/plaid/schedule'

initServer()
startScheduler()
