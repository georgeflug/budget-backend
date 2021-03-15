import { PlaidTransaction } from '../plaid/plaid-types'
import { DbRecord, dbRecordSchema } from '../db/json-db'
import Joi from 'joi'

export type UnsavedRawPlaid = {
  data: PlaidTransaction[]
}

export type RawPlaid = DbRecord & UnsavedRawPlaid

export const rawPlaidSchema = dbRecordSchema
  .keys({
    data: Joi.array().items(Joi.object().label('Raw-Plaid Internal Data')).label('Raw-Plaid Internal Data List'),
  })
  .label('Raw-Plaid')
