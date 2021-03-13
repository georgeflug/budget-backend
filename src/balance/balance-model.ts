import { DbRecord, dbRecordSchema } from '../db/json-db'
import Joi from 'joi'

export type UnsavedBalance = {
  accountId: string
  amount: number
  name: string
}

export type Balance = DbRecord & UnsavedBalance

export const balanceSchema = dbRecordSchema.keys({
  accountId: Joi.string(),
  amount: Joi.number(),
  name: Joi.string(),
})
