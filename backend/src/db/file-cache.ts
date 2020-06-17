import { promises as fs } from "fs";

const PENDING = 'PENDING';

export class FileCache {
  private cache = {};

  async readFile(path: string): Promise<string> {
    let cached = this.cache[path];
    if (cached) {
      while (cached === PENDING) {
        await new Promise(setImmediate);
        cached = this.cache[path];
      }
      return cached;
    }
    this.cache[path] = PENDING;
    const buffer = await fs.readFile(path);
    const data = buffer.toString();
    this.cache[path] = data;
    return data;
  }
}
