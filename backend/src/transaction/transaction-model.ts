import { DbRecord } from "../db/json-db";

export type UnsavedTransactionV2 = {
  plaidId: string,
  totalAmount: number,
  account: string,
  postedDate: Date,
  postedDescription: string,
  pending: boolean,
  splits: TransactionSplit[], // splits will have 1 item for un-split transactions
}

export type TransactionV2 = DbRecord & UnsavedTransactionV2

export interface TransactionSplit {
  amount: number,
  budget: string,
  description: string,
}
