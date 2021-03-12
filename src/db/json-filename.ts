const FILENAME_LENGTH = 6;
const VERSION_LENGTH = 2;

export type ParsedFileName = {
  recordId: number,
  version: number
}

export class JsonFileName {

  static getRecordId(fileName: string): number {
    return parseInt(fileName.split(".")[0]);
  }

  static getVersion(fileName: string): number {
    return parseInt(fileName.split(".")[1]);
  }

  static parse(fileName: string): ParsedFileName {
    return {
      recordId: JsonFileName.getRecordId(fileName),
      version: JsonFileName.getVersion(fileName),
    };
  }

  static getFileName(recordId: number, version: number): string {
    const recordPart = zeroFill(recordId, FILENAME_LENGTH);
    const versionPart = zeroFill(version, VERSION_LENGTH);
    return `${recordPart}.${versionPart}.json`;
  }

}

function zeroFill(value: number, length: number): string {
  const valAsString = value + "";
  return valAsString.padStart(length, "0");
}
