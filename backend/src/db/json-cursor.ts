import { existsSync, promises as fs } from "fs";
import { JsonFileName } from "./json-filename";
import { resolve } from "path";

export class JsonCursor {
  cachedNextRecord: number = 1;

  constructor(private path: string) {
  }

  async nextRecord(): Promise<number> {
    const nextRecord = await this.getNextRecord();
    this.cachedNextRecord = nextRecord + 1;
    return nextRecord;
  }

  private async getNextRecord(): Promise<number> {
    if (!existsSync(this.getPath(this.cachedNextRecord, 1))) {
      return this.cachedNextRecord;
    }
    return await this.recalculateNextRecord();
  }

  private async recalculateNextRecord(): Promise<number> {
    const fileNames = await fs.readdir(this.path);
    const ids = fileNames.map(name => JsonFileName.getRecordId(name));
    return Math.max(...ids) + 1;
  }

  private getPath(recordId: number, version: number) {
    const fileName = JsonFileName.getFileName(recordId, version);
    return resolve(this.path, fileName);
  }
}
