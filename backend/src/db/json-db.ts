import { resolve } from "path";
import { existsSync, mkdirSync, promises as fs } from "fs";
import { DateUtil } from "../util/date-util";
import { parseISO } from "date-fns";
import { JsonFileName } from "./json-filename";
import { JsonCursor } from "./json-cursor";

export type DbRecord<T> = {
  recordId: number,
  version: number,
  createdAt: Date,
  modifiedAt: Date,
  data: T
}

export class JsonDatabase<T> {
  private cursor = new JsonCursor(this.path);

  constructor(private path: string) {
    if (!existsSync(this.path)) {
      mkdirSync(path);
    }
  }

  async listRecords(): Promise<DbRecord<T>[]> {
    const fileNames = await fs.readdir(this.path);
    const deduplicatedFileNames = fileNames.filter(name => JsonFileName.getVersion(name) === 1);
    const recordIds = deduplicatedFileNames.map(fileName => JsonFileName.getRecordId(fileName));
    const records = recordIds.map(recordId => this.getRecord(recordId));
    return Promise.all(records);
  }

  async createRecord(data: T): Promise<DbRecord<T>> {
    const recordId = await this.cursor.nextRecord();
    const newRecord = this.createRecordInMemory(recordId, data);
    await this.writeRecord(newRecord);
    return newRecord;
  }

  async updateRecord(recordId: number, recordVersion: number, data: T): Promise<DbRecord<T>> {
    const existingRecord = await this.getRecord(recordId);
    if (existingRecord.version !== recordVersion) {
      throw new Error(`Record ${recordId} Version ${recordVersion} has already been updated.`);
    }
    const now = DateUtil.now();
    const newVersion = existingRecord.version + 1;
    const newRecord: DbRecord<T> = {
      recordId: recordId,
      version: newVersion,
      createdAt: existingRecord.createdAt,
      modifiedAt: now,
      data: data,
    };
    await this.writeRecord(newRecord);
    return newRecord;
  }

  async getRecord(recordId: number): Promise<DbRecord<T>> {
    const version = await this.getLatestVersion(recordId);
    return await this.getArchivedRecord(recordId, version);
  }

  async getArchivedRecord(recordId: number, version: number): Promise<DbRecord<T>> {
    const rawData = await this.readRecordFile(recordId, version);
    const record = JSON.parse(rawData) as DbRecord<T>;
    record.createdAt = parseISO(record.createdAt as any);
    record.modifiedAt = parseISO(record.modifiedAt as any);
    return record;
  }

  private createRecordInMemory(recordId: number, data: T): DbRecord<T> {
    const now = DateUtil.now();
    return {
      recordId: recordId,
      version: 1,
      createdAt: now,
      modifiedAt: now,
      data: data
    };
  }

  private async writeRecord(record: DbRecord<T>) {
    const path = this.getPath(record.recordId, record.version);
    const contents = JSON.stringify(record);
    await fs.writeFile(path, contents);
  }

  private async getLatestVersion(recordId: number): Promise<number> {
    const fileNames = await fs.readdir(this.path);
    const filesForRecord = fileNames.filter(name => JsonFileName.getRecordId(name) === recordId);
    if (filesForRecord.length === 0) {
      throw new Error(`Record ${recordId} does not exist.`);
    }
    const versionStrings = fileNames.map(name => name.split('.')[1]);
    const versions = versionStrings.map(version => parseInt(version));
    return Math.max(...versions);
  }

  private async readRecordFile(recordId: number, version: number): Promise<string> {
    try {
      const data = await fs.readFile(this.getPath(recordId, version));
      return data.toString();
    } catch (e) {
      throw new Error(`Record ${recordId} Version ${version} does not exist.`);
    }
  }

  private getPath(recordId: number, version: number) {
    const fileName = JsonFileName.getFileName(recordId, version);
    return resolve(this.path, fileName);
  }
}

