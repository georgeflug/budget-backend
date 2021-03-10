import {Route} from "./route";

import { featureIdeaRoute } from '../feature-idea/feature-idea-controller'
import {statusRoute} from "./status/status-controller";
import {transactionRoute} from "../transaction/transaction-controller";
import {refreshRoute} from "./refresh/refresh-controller";
import {balanceRoute} from "../balance/balance-controller";
import {checkAccountConnectivityRoute} from "./check-account-connectivity/check-accounts-controller";
import {rawPlaidRoute} from "../raw-plaid/raw-plaid-controller";

export const routes = [
  featureIdeaRoute,
  statusRoute,
  transactionRoute,
  refreshRoute,
  balanceRoute,
  checkAccountConnectivityRoute,
  rawPlaidRoute,
] as Route[]
