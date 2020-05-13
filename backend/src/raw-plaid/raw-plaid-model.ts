import { PlaidTransaction } from "../plaid/plaid-types";
import { DbRecord } from "../db/json-db";

export interface RawPlaid {
  date: Date,
  data: PlaidTransaction[]
}

export type RawPlaidV2 = DbRecord & {
  data: PlaidTransaction[]
}
