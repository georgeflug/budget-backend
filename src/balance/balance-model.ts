import { DbRecord } from "../db/json-db";

export type UnsavedBalance = {
  accountId: string,
  amount: number,
  name: string
}

export type Balance = DbRecord & UnsavedBalance
