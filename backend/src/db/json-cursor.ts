import { readFileSync, writeFileSync } from "fs-extra";
import { resolve } from "path";

const CURSOR_FILENAME = 'nextRecord.txt';

export class JsonCursor {
  cursorFileName: string;

  constructor(private path: string) {
    this.cursorFileName = resolve(path, CURSOR_FILENAME);
    this.createCursorFileIfNotExists();
  }

  async nextRecord(): Promise<number> {
    // intentionally use synchronous methods to prevent same record number being used more than once
    console.log('read');
    let rawData;
    try {
      rawData = readFileSync(this.cursorFileName);
    } catch (e) {
      console.log(e);
    }
    console.log('done read');
    const nextRecord = parseInt(rawData.toString());
    const newData = (nextRecord + 1).toString();
    writeFileSync(this.cursorFileName, newData);
    return nextRecord;
  }

  private async createCursorFileIfNotExists() {
    try {
      writeFileSync(this.cursorFileName, '1', { flag: 'wx' });
    } catch (e) {
      if (e.code !== 'EEXIST') { // expected error due to 'wx' flag
        throw e;
      }
    }
  }
}
