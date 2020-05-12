import { promises as fs } from "fs";

export class FileCache {
  private cache = {};

  async readFile(path: string): Promise<string> {
    const cached = this.cache[path];
    if (cached) {
      return cached;
    }
    const buffer = await fs.readFile(path);
    const data = buffer.toString();
    this.cache[path] = data;
    return data;
  }
}
