import {FileLister} from "./file-lister";
import {JsonFileName, ParsedFileName} from "./json-filename";

export class RecordLister {
  constructor(private path: string,
              private fileLister: FileLister = new FileLister(path)) {
  }

  async listLatestRecords(): Promise<ParsedFileName[]> {
    const fileNames = await this.fileLister.listFiles();
    const records = fileNames.map(name => JsonFileName.parse(name));
    const map = {};
    records.forEach(record => {
      if (record.version) {
        const existing = map[record.recordId];
        if (!existing || existing.version < record.version) {
          map[record.recordId] = record;
        }
      }
    });
    return Object.values(map);
  }

  async shutdown() {
    await this.fileLister.shutdown();
  }
}