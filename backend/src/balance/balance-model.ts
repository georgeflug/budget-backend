import { DbRecord } from "../db/json-db";

export interface Balance {
  accountId: string,
  balance: number,
  date: Date,
  name: string
}

export type BalanceV2 = DbRecord & {
  accountId: string,
  amount: number,
  name: string
}
