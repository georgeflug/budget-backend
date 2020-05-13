import { DbRecord } from "../db/json-db";

export interface Transaction {
  plaidId: string,
  date: Date,
  totalAmount: number,
  account: string,
  postedDate: Date,
  postedDescription: string,
  updatedAt: Date,
  pending: boolean,
  splits: TransactionSplit[], // splits will have 1 item for un-split transactions
}

export type TransactionV2 = DbRecord & {
  plaidId: string,
  totalAmount: number,
  account: string,
  postedDate: Date,
  postedDescription: string,
  pending: boolean,
  splits: TransactionSplit[], // splits will have 1 item for un-split transactions
}

export interface TransactionSplit {
  amount: number,
  budget: string,
  description: string,
}
