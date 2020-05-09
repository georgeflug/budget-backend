import { resolve } from "path";
import { existsSync, mkdirSync, promises as fs } from "fs";
import { DateUtil } from "../util/date-util";
import { parseISO } from "date-fns";

export type DbRecord<T> = {
  recordId: number,
  version: number,
  createdAt: Date,
  modifiedAt: Date,
  modifiedBy: string,
  data: T
}

const FILENAME_LENGTH = 6;

export class JsonDatabase<T> {
  nextRecord: number = 1;

  constructor(private path: string) {
    if (!existsSync(this.path)) {
      mkdirSync(path);
    }
  }

  async listRecords(): Promise<DbRecord<T>[]> {
    const fileNames = await fs.readdir(this.path);
    const recordIds = fileNames.map(fileName => this.getRecordIdFromFilename(fileName));
    const records = recordIds.map(recordId => this.getRecord(recordId));
    return Promise.all(records);
  }

  async createRecord(data: T): Promise<DbRecord<T>> {
    const recordId = await this.getNextRecord();
    this.nextRecord = recordId + 1;
    const now = DateUtil.now();
    const newRecord: DbRecord<T> = {
      recordId: recordId,
      version: 1,
      createdAt: now,
      modifiedAt: now,
      modifiedBy: "",
      data: data,
    };
    await fs.writeFile(this.getPath(recordId), JSON.stringify(newRecord));
    return newRecord;
  }

  async updateRecord(dbRecord: DbRecord<T>): Promise<DbRecord<T>> {
    return {} as any;
  }

  async getRecord(recordId: number): Promise<DbRecord<T>> {
    const rawData = await fs.readFile(this.getPath(recordId));
    const record = JSON.parse(rawData.toString()) as DbRecord<T>;
    record.createdAt = parseISO(record.createdAt as any);
    record.modifiedAt = parseISO(record.modifiedAt as any);
    return record;
  }

  private async getNextRecord(): Promise<number> {
    if (!existsSync(this.getPath(this.nextRecord))) {
      return this.nextRecord;
    }
    return await this.recalculateNextRecord();
  }

  private async recalculateNextRecord(): Promise<number> {
    const fileNames = await fs.readdir(this.path);
    const ids = fileNames.map(name => this.getRecordIdFromFilename(name));
    return Math.max(...ids) + 1;
  }

  private getRecordIdFromFilename(filename: string): number {
    return parseInt(filename.substring(0, FILENAME_LENGTH));
  }

  private getPath(recordId: number) {
    const fileName = (recordId + '').padStart(FILENAME_LENGTH, '0');
    return resolve(this.path, `${fileName}.json`);
  }
}

