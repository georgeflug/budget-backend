import { PlaidTransaction } from "../plaid/plaid-types";

export interface RawPlaid {
  date: Date,
  data: PlaidTransaction[]
}
