import { DbRecord, dbRecordSchema } from '../db/json-db'
import Joi from 'joi'

export type UnsavedTransactionV2 = {
  plaidId: string
  totalAmount: number
  account: string
  postedDate: Date
  postedDescription: string
  pending: boolean
  splits: TransactionSplit[] // splits will have 1 item for un-split transactions
}

export type TransactionV2 = DbRecord & UnsavedTransactionV2

export interface TransactionSplit {
  amount: number
  budget: string
  description: string
}

export const transactionSplitSchema = Joi.object({
  amount: Joi.number(),
  budget: Joi.string().empty(''),
  description: Joi.string().empty(''),
}).label('Transaction-Split')

export const transactionSplitListSchema = Joi.array()
  .items(transactionSplitSchema)
  .min(1)
  .label('Transaction-Split List')

export const transactionV2Schema = dbRecordSchema
  .keys({
    plaidId: Joi.string(),
    totalAmount: Joi.number(),
    account: Joi.string(),
    postedDate: Joi.date(),
    postedDescription: Joi.string(),
    pending: Joi.boolean(),
    splits: transactionSplitListSchema,
  })
  .label('Transaction')
