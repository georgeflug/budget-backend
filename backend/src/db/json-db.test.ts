import { JsonDatabase } from "./json-db";
import * as fs from "fs";
import * as Path from "path";
import { DateUtil } from "../util/date-util";

jest.mock('../util/date-util');
const mockedDateUtil = DateUtil as jest.Mocked<typeof DateUtil>;

const dbPath = "tmp";

describe("JSON Database", () => {
  let db: JsonDatabase<string>;

  beforeEach(async () => {
    deleteDb();
    db = createDb();
  });

  afterEach(async () => {
    deleteDb();
  });

  it("should list nothing on an empty database", async () => {
    // no arrange

    const records = await db.listRecords();

    expect(records).toEqual([]);
  });

  it("should list 1 entry after entry is created", async () => {
    await db.createRecord("test-data");

    const records = await db.listRecords();

    expect(records.length).toEqual(1);
    expect(records[0].data).toEqual("test-data");
  });

  it("should list 2 entries after 2 entries are created", async () => {
    await db.createRecord("test-data1");
    await db.createRecord("test-data2");

    const records = await db.listRecords();

    expect(records.length).toEqual(2);
    expect(records[0].data).toEqual("test-data1");
    expect(records[1].data).toEqual("test-data2");
  });

  it("should list 2 entries after 2 entries are created in separate instances", async () => {
    await db.createRecord("test-data1");
    const db2 = createDb();
    await db2.createRecord("test-data2");

    const records = await db.listRecords();

    expect(records.length).toEqual(2);
    expect(records[0].data).toEqual("test-data1");
    expect(records[1].data).toEqual("test-data2");
  });

  it("should get record by id after creating it", async () => {
    await db.createRecord("test-data");

    const record = await db.getRecord(1);

    expect(record.data).toEqual('test-data');
  });

  it("should return the record after creating it", async () => {
    // no arrange

    const record = await db.createRecord("test-data");

    expect(record.data).toEqual('test-data');
    expect(record.recordId).toEqual(1);
  });

  it("should return the created time and modified time of the record after creating it", async () => {
    const mockedDate = new Date(123456);
    // intentionally return date only once to ensure created/modified dates are exactly the same
    mockedDateUtil.now.mockReturnValueOnce(mockedDate);

    const createdRecord = await db.createRecord("test-data");
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(createdRecord.createdAt).toEqual(mockedDate);
    expect(createdRecord.modifiedAt).toEqual(mockedDate);
    expect(retrievedRecord.createdAt).toEqual(mockedDate);
    expect(retrievedRecord.modifiedAt).toEqual(mockedDate);
  });

  it("should return a version of the data after creating it", async () => {
    // no arrange

    const record = await db.createRecord("test-data");

    expect(record.version).toEqual(1);
  });

});

function createDb(): JsonDatabase<string> {
  return new JsonDatabase<string>(dbPath);
}

function deleteDb() {
  if (fs.existsSync(dbPath)) {
    fs.readdirSync(dbPath).forEach(file => {
      fs.unlinkSync(Path.join(dbPath, file));
    });
    fs.rmdirSync(dbPath);
  }
}
