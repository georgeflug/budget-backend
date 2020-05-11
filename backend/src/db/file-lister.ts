import { promises as fs, watch } from "fs";
import { resolve } from "path";
import { exists } from "../util/fs-util";

export class FileLister {
  private files: string[] = [];
  private watcher = watch(this.path, { persistent: false }, (eventType, fileName) => this.onFileChanged(eventType, fileName));

  constructor(private path: string) {
  }

  async listFiles(): Promise<string[]> {
    if (this.files.length === 0) {
      this.files = await fs.readdir(this.path);
    }
    return this.files;
  }

  async shutdown() {
    return new Promise(cb => {
      this.watcher.on('close', () => cb());
      this.watcher.close();
    });
  }

  private async onFileChanged(_, fileName: string) {
    if (await exists(resolve(this.path, fileName))) {
      this.addToCache(fileName);
    } else {
      this.removeFromCache(fileName);
    }
  }

  private addToCache(fileName: string) {
    if (!this.files.includes(fileName)) {
      this.files.push(fileName);
    }
  }

  private removeFromCache(fileName: string) {
    const location = this.files.indexOf(fileName);
    if (location !== -1) {
      this.files.splice(location, 1);
    }
  }

}
