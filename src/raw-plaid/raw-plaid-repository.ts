import { PlaidTransaction } from '../plaid/plaid-types'
import { RawPlaid, UnsavedRawPlaid } from './raw-plaid-model'
import { JsonDatabase } from '../db/json-db'
import { SmartDate } from '../util/smart-date'
import { config } from '../util/config'

const db = new JsonDatabase<UnsavedRawPlaid>(`${config.dataFolder}/raw-plaid`)

export async function saveRawPlaid(transactions: PlaidTransaction[]): Promise<RawPlaid> {
  return await db.createRecord({ data: transactions })
}

export async function findRawPlaidBetween(startDate: Date, endDate: Date): Promise<RawPlaid[]> {
  const startingAt = SmartDate.of(startDate)
  const endingAt = SmartDate.of(endDate)
  const results = await db.listRecords()
  return results
    .filter(record => startingAt.isSameOrBefore(record.modifiedAt))
    .filter(record => endingAt.isSameOrAfter(record.modifiedAt))
}
