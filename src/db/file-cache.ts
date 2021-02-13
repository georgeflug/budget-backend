import { readFile } from "fs-extra";

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
    let data: string | null = null;
    this.cache[path] = PENDING;
    try {
      const buffer = await readFile(path);
      data = buffer.toString();
    } finally {
      this.cache[path] = data;
    }
    return data;
  }
}
