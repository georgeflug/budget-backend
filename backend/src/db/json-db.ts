import { resolve } from "path";
import { promises as fs } from "fs";
import { DateUtil } from "../util/date-util";
import { parseISO } from "date-fns";
import { JsonFileName } from "./json-filename";
import { JsonCursor } from "./json-cursor";
import { FileLister } from "./file-lister";
import { mkDirIfNotExists } from "../util/fs-util";
import { FileCache } from "./file-cache";

export type DbRecord = {
  recordId: number,
  version: number,
  createdAt: Date,
  modifiedAt: Date
}

const dbRecordKeys: Array<keyof DbRecord> = ["recordId", "version", "createdAt", "modifiedAt"];

export class JsonDatabase<T> {
  private cursor = new JsonCursor(this.path);
  private fileLister: FileLister;
  private fileCache = new FileCache();

  constructor(private path: string) {
    mkDirIfNotExists(this.path);
    this.fileLister = new FileLister(this.path);
  }

  async shutdown() {
    await this.fileLister.shutdown();
  }

  async listRecords(): Promise<DbRecord[] & T[]> {
    const fileNames = await this.fileLister.listFiles();
    const dbRows = fileNames.map(name => JsonFileName.parse(name))
      .filter(row => row.version === 1);
    const records = dbRows.map(row => this.getRecord(row.recordId));
    return Promise.all(records);
  }

  async createRecord(data: T): Promise<DbRecord & T> {
    const recordId = await this.cursor.nextRecord();
    const newRecord = this.buildNewRecord(recordId, data);
    await this.writeRecord(newRecord);
    return newRecord;
  }

  async updateRecord(recordId: number, recordVersion: number, data: T): Promise<DbRecord & T> {
    const existingRecord = await this.getRecord(recordId);
    if (existingRecord.version !== recordVersion) {
      throw new Error(`Record ${recordId} Version ${recordVersion} has already been updated.`);
    }
    const newRecord = this.buildUpdatedRecord(existingRecord, data);
    await this.writeRecord(newRecord);
    return newRecord;
  }

  async getRecord(recordId: number): Promise<DbRecord & T> {
    const version = await this.getLatestVersion(recordId);
    return await this.getArchivedRecord(recordId, version);
  }

  async getArchivedRecord(recordId: number, version: number): Promise<DbRecord & T> {
    const rawData = await this.readFile(recordId, version);
    const record = JSON.parse(rawData) as (DbRecord & T);
    record.createdAt = parseISO(record.createdAt as any);
    record.modifiedAt = parseISO(record.modifiedAt as any);
    return record;
  }

  private buildNewRecord(recordId: number, data: T): DbRecord & T {
    const now = DateUtil.now();
    return {
      createdAt: now,
      modifiedAt: now,
      ...data,
      recordId: recordId,
      version: 1,
    };
  }

  private buildUpdatedRecord(existingRecord: DbRecord, data: T): DbRecord & T {
    return {
      ...data,
      recordId: existingRecord.recordId,
      version: existingRecord.version + 1,
      createdAt: existingRecord.createdAt,
      modifiedAt: DateUtil.now(),
    };
  }

  private async writeRecord(record: DbRecord) {
    const path = this.getPath(record.recordId, record.version);
    const contents = JSON.stringify(record, this.getKeySortOrder(record), 2);
    await fs.writeFile(path, contents);
  }

  private getKeySortOrder(record: DbRecord): string[] {
    const dataKeys = Object.keys(record)
      .filter(key => !dbRecordKeys.includes(<any>key))
      .sort();
    return [...dbRecordKeys, ...dataKeys];
  }

  private async getLatestVersion(recordId: number): Promise<number> {
    const fileNames = await this.fileLister.listFiles();
    const dbRows = fileNames.map(name => JsonFileName.parse(name))
      .filter(row => row.recordId === recordId);
    if (dbRows.length === 0) {
      throw new Error(`Record ${recordId} does not exist.`);
    }
    const versions = dbRows.map(row => row.version);
    return Math.max(...versions);
  }

  private async readFile(recordId: number, version: number): Promise<string> {
    try {
      return await this.fileCache.readFile(this.getPath(recordId, version));
    } catch (e) {
      throw new Error(`Record ${recordId} Version ${version} does not exist.`);
    }
  }

  private getPath(recordId: number, version: number) {
    const fileName = JsonFileName.getFileName(recordId, version);
    return resolve(this.path, fileName);
  }
}

