import { TransactionV2, UnsavedTransactionV2 } from './transaction-model'
import { JsonDatabase } from '../db/json-db'
import { parseISO } from 'date-fns'
import { config } from '../util/config'

export class TransactionRepository {
  private db: JsonDatabase<UnsavedTransactionV2>

  constructor(jsonDb?: JsonDatabase<UnsavedTransactionV2>) {
    this.db = jsonDb || new JsonDatabase<UnsavedTransactionV2>(`${config.dataFolder}/transactions`)
  }

  async saveTransaction(transaction: UnsavedTransactionV2): Promise<TransactionV2> {
    const result = await this.db.createRecord(transaction)
    return adaptTransactionFromDb(result)
  }

  async listTransactions(): Promise<TransactionV2[]> {
    const results = await this.db.listRecords()
    return results.map(item => adaptTransactionFromDb(item))
  }

  async findTransactionById(id: number): Promise<TransactionV2> {
    const result = await this.db.getRecord(id)
    return adaptTransactionFromDb(result)
  }

  async updateTransactionById(id: number, version: number, transaction: UnsavedTransactionV2): Promise<TransactionV2> {
    const result = await this.db.updateRecord(id, version, transaction)
    return adaptTransactionFromDb(result)
  }
}

function adaptTransactionFromDb(transaction: TransactionV2): TransactionV2 {
  transaction.postedDate = parseISO((transaction.postedDate as unknown) as string)
  return transaction
}
