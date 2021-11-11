import { featureIdeaRoutes } from '../feature-idea/feature-idea-controller'
import { ServerRoute } from '@hapi/hapi'
import { statusRoutes } from './status/status-controller'
import { transactionRoutes } from '../transaction/transaction-controller'
import { refreshRoutes } from './refresh/refresh-controller'
import { balanceRoutes } from '../balance/balance-controller'
import { checkAccountConnectivityRoutes } from './check-account-connectivity/check-accounts-controller'
import { rawPlaidRoutes } from '../raw-plaid/raw-plaid-controller'
import { staticFileRoutes } from './static-files'

export const routes = [
  featureIdeaRoutes,
  statusRoutes,
  transactionRoutes,
  refreshRoutes,
  balanceRoutes,
  checkAccountConnectivityRoutes,
  rawPlaidRoutes,
  staticFileRoutes,
].flat() as ServerRoute[]
