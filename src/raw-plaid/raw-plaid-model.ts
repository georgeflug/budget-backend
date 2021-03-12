import { PlaidTransaction } from '../plaid/plaid-types'
import { DbRecord } from '../db/json-db'

export type UnsavedRawPlaid = {
  data: PlaidTransaction[]
}

export type RawPlaid = DbRecord & UnsavedRawPlaid
