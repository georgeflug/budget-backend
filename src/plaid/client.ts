import * as plaid from "plaid";
import { config } from "../util/config";

let plaidClient: plaid.Client

export function getPlaidClient(): plaid.Client {
  if (!plaidClient) {
    plaidClient = new plaid.Client(
      config.plaidClientId,
      config.plaidSecret,
      config.plaidPublicKey,
      plaid.environments[config.plaidEnv],
      {
        version: "2018-05-22"
      }
    );
  }
  return plaidClient
}
