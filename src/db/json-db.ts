import { resolve } from 'path'
import { ensureDirSync, writeFile } from 'fs-extra'
import { DateUtil } from '../util/date-util'
import { parseISO } from 'date-fns'
import { JsonFileName } from './json-filename'
import { JsonCursor } from './json-cursor'
import { FileCache } from './file-cache'
import { deepCompare, orderedStringify } from '../util/json-util'
import { RecordLister } from './record-lister'
import Joi from 'joi'

export type DbRecord = {
  recordId: number
  version: number
  createdAt: Date
  modifiedAt: Date
}

export const dbRecordSchema = Joi.object({
  recordId: Joi.number(),
  version: Joi.number(),
  createdAt: Joi.date(),
  modifiedAt: Joi.date(),
})

const dbRecordKeys: Array<keyof DbRecord> = ['recordId', 'version', 'createdAt', 'modifiedAt']

export class JsonDatabase<T> {
  private cursor: JsonCursor
  private recordLister: RecordLister
  private fileCache = new FileCache()

  constructor(private path: string) {
    ensureDirSync(this.path)
    this.recordLister = new RecordLister(this.path)
    this.cursor = new JsonCursor(this.path)
  }

  async shutdown(): Promise<void> {
    await this.recordLister.shutdown()
  }

  async listRecords(): Promise<(DbRecord & T)[]> {
    const recordIds = await this.recordLister.listLatestRecords()
    const records = recordIds.map(id => this.getArchivedRecord(id.recordId, id.version))
    return Promise.all(records)
  }

  async createRecord(data: T): Promise<DbRecord & T> {
    const recordId = await this.cursor.nextRecord()
    const newRecord = this.buildNewRecord(recordId, data)
    await this.writeRecord(newRecord)
    return newRecord
  }

  async updateRecord(recordId: number, recordVersion: number, data: T): Promise<DbRecord & T> {
    const existingRecord = await this.getRecord(recordId)
    if (existingRecord.version !== recordVersion) {
      throw new Error(`Record ${recordId} Version ${recordVersion} has already been updated.`)
    }
    const newRecord = this.buildUpdatedRecord(existingRecord, data)
    if (JsonDatabase.recordContentsAreTheSame(existingRecord, newRecord)) {
      return existingRecord
    }
    await this.writeRecord(newRecord)
    return newRecord
  }

  async getRecord(recordId: number): Promise<DbRecord & T> {
    const version = await this.getLatestVersion(recordId)
    return await this.getArchivedRecord(recordId, version)
  }

  async getArchivedRecord(recordId: number, version: number): Promise<DbRecord & T> {
    const rawData = await this.readFile(recordId, version)
    const record = JSON.parse(rawData) as DbRecord & T
    record.createdAt = parseISO((record.createdAt as unknown) as string)
    record.modifiedAt = parseISO((record.modifiedAt as unknown) as string)
    return record
  }

  private buildNewRecord(recordId: number, data: T): DbRecord & T {
    const now = DateUtil.now()
    return {
      createdAt: now,
      modifiedAt: now,
      ...data,
      recordId: recordId,
      version: 1,
    }
  }

  private buildUpdatedRecord(existingRecord: DbRecord, data: T): DbRecord & T {
    return {
      ...data,
      recordId: existingRecord.recordId,
      version: existingRecord.version + 1,
      createdAt: existingRecord.createdAt,
      modifiedAt: DateUtil.now(),
    }
  }

  private async writeRecord(record: DbRecord) {
    const path = this.getPath(record.recordId, record.version)
    const contents = orderedStringify(record, dbRecordKeys)
    await writeFile(path, contents, { flag: 'wx' })
  }

  private async getLatestVersion(recordId: number): Promise<number> {
    const fileNames = await this.recordLister.listLatestRecords()
    const dbRows = fileNames.filter(row => row.recordId === recordId)
    if (dbRows.length === 0) {
      throw new Error(`Record ${recordId} does not exist.`)
    }
    return dbRows[0].version
  }

  private async readFile(recordId: number, version: number): Promise<string> {
    try {
      return await this.fileCache.readFile(this.getPath(recordId, version))
    } catch (e) {
      throw new Error(`Record ${recordId} Version ${version} does not exist.`)
    }
  }

  private getPath(recordId: number, version: number) {
    const fileName = JsonFileName.getFileName(recordId, version)
    return resolve(this.path, fileName)
  }

  private static recordContentsAreTheSame(existingRecord: DbRecord, newRecord: DbRecord) {
    const existingCopy = { ...existingRecord }
    delete existingCopy.version
    delete existingCopy.modifiedAt
    const newCopy = { ...newRecord }
    delete newCopy.version
    delete newCopy.modifiedAt
    return deepCompare(existingCopy, newCopy)
  }
}
