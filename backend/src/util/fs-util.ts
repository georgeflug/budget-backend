import * as fs from "fs";
import { promises as fsPromises } from "fs";
import * as Path from "path";

export function mkDirIfNotExists(path: string) {
  try {
    fs.mkdirSync(path);
  } catch (e) { // ignore
  }
}

export function rmRf(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(file => {
      fs.unlinkSync(Path.join(path, file));
    });
    fs.rmdirSync(path);
  }
}

export async function exists(path: string): Promise<boolean> {
  try {
    await fsPromises.access(path, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}
