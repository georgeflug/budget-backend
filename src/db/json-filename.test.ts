import { JsonFileName } from "./json-filename";

describe("Json FileName", () => {

  it('should get record id', () => {
    // no arrange

    const recordId = JsonFileName.getRecordId('123456.12.json');

    expect(recordId).toEqual(123456);
  });

  it('should get version', () => {
    // no arrange

    const version = JsonFileName.getVersion('123456.12.json');

    expect(version).toEqual(12);
  });

  it('should get filename', () => {
    // no arrange

    const fileName = JsonFileName.getFileName(123456, 12);

    expect(fileName).toEqual('123456.12.json');
  });

  it('should get record id and version even in the nearly impossible scenario that the fixed lengths are exceeded', () => {
    const fileName = '123456789.12345.json';

    const recordId = JsonFileName.getRecordId(fileName);
    const version = JsonFileName.getVersion(fileName);

    expect(recordId).toEqual(123456789);
    expect(version).toEqual(12345);
  });

});
