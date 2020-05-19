import * as plaid from "plaid";
import { config } from "../util/config";

export const plaidClient = new plaid.Client(
  config.plaidClientId,
  config.plaidSecret,
  config.plaidPublicKey,
  plaid.environments[config.plaidEnv],
  {
    version: "2018-05-22"
  }
);
