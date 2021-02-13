import { DbRecord, JsonDatabase } from "./json-db";
import { DateUtil } from "../util/date-util";
import { remove } from "fs-extra";

jest.mock("../util/date-util");
const mockedDateUtil = DateUtil as jest.Mocked<typeof DateUtil>;

const dbPath = "tmp/db-tests";

describe("JSON Database", () => {
  let db: JsonDatabase<{ data: string }>;

  beforeEach(async () => {
    await remove(dbPath);
    db = createDb();
  });

  afterEach(async () => {
    await db.shutdown();
    await remove(dbPath);
  });

  it("should list nothing on an empty database", async () => {
    // no arrange

    const records = await db.listRecords();

    expect(records).toEqual([]);
  });

  it("should list 1 entry after entry is created", async () => {
    await db.createRecord({ data: "test-data" });

    const records = await db.listRecords();

    expect(records.length).toEqual(1);
    expect(records[0].data).toEqual("test-data");
  });

  it("should list 2 entries after 2 entries are created", async () => {
    await db.createRecord({ data: "test-data1" });
    await db.createRecord({ data: "test-data2" });

    const records = await db.listRecords();

    expect(records.length).toEqual(2);
    expect(records[0].data).toEqual("test-data1");
    expect(records[1].data).toEqual("test-data2");
  });

  it("should list 2 entries after 2 entries are created in separate instances", async () => {
    await db.createRecord({ data: "test-data1" });
    const db2 = createDb();
    try {
      await db2.createRecord({ data: "test-data2" });

      const records = await db.listRecords();

      expect(records.length).toEqual(2);
      expect(records[0].data).toEqual("test-data1");
      expect(records[1].data).toEqual("test-data2");
    } finally {
      await db2.shutdown();
    }
  });

  it("should get record by id after creating it", async () => {
    await db.createRecord({ data: "test-data" });

    const record = await db.getRecord(1);

    expect(record.data).toEqual("test-data");
  });

  it("should return the record after creating it", async () => {
    // no arrange

    const record = await db.createRecord({ data: "test-data" });

    expect(record.data).toEqual("test-data");
    expect(record.recordId).toEqual(1);
  });

  it("should return the created time and modified time of the record after creating it", async () => {
    const mockedDate = new Date(123456);
    // intentionally return date only once to ensure created/modified dates are exactly the same
    mockedDateUtil.now.mockReturnValueOnce(mockedDate);

    const createdRecord = await db.createRecord({ data: "test-data" });
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(createdRecord.createdAt).toEqual(mockedDate);
    expect(createdRecord.modifiedAt).toEqual(mockedDate);
    expect(retrievedRecord.createdAt).toEqual(mockedDate);
    expect(retrievedRecord.modifiedAt).toEqual(mockedDate);
  });

  it("should return the version of the data after creating it", async () => {
    // no arrange

    const createdRecord = await db.createRecord({ data: "test-data" });
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(createdRecord.version).toEqual(1);
    expect(retrievedRecord.version).toEqual(1);
  });

  it("should throw an error when trying to retrieve a non-existent record", async () => {
    // no arrange

    const promise = db.getRecord(1);

    await expect(promise).rejects.toEqual(new Error("Record 1 does not exist."));
  });

  it("should throw an error when trying to modify a non-existent record", async () => {
    // no arrange

    const promise = db.updateRecord(1, 1, { data: "doesNotMatter" });

    await expect(promise).rejects.toEqual(new Error("Record 1 does not exist."));
  });

  it("should modify an existing record's data", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    const updatedRecord = await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(updatedRecord.data).toEqual("updated-data");
    expect(retrievedRecord.data).toEqual("updated-data");
  });

  it("should update a record's modifiedAt field, but not createdAt, when updating a record", async () => {
    const mockedDate = new Date(123456);
    mockedDateUtil.now.mockReturnValueOnce(mockedDate);
    const createdRecord = await db.createRecord({ data: "test-data" });
    const mockedDate2 = new Date(789012);
    mockedDateUtil.now.mockReturnValueOnce(mockedDate2);

    const updatedRecord = await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(updatedRecord.modifiedAt).toEqual(mockedDate2);
    expect(retrievedRecord.modifiedAt).toEqual(mockedDate2);
    expect(updatedRecord.createdAt).toEqual(mockedDate);
    expect(retrievedRecord.createdAt).toEqual(mockedDate);
  });

  it("should update a record's version when updating a record", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    const updatedRecord = await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(updatedRecord.version).toEqual(2);
    expect(retrievedRecord.version).toEqual(2);
  });

  it("should throw an error when trying to update the wrong version of a record", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});
    const promise = db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});

    await expect(promise).rejects.toEqual(new Error("Record 1 Version 1 has already been updated."));
  });

  it("should update a record twice", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    const updatedRecord1 = await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data1" });
    const updatedRecord2 = await db.updateRecord(createdRecord.recordId, 2, { data: "updated-data2" });

    expect(updatedRecord1.data).toEqual("updated-data1");
    expect(updatedRecord2.data).toEqual("updated-data2");
    expect(updatedRecord1.version).toEqual(2);
    expect(updatedRecord2.version).toEqual(3);
  });

  it("should retrieve an old version of a record", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });
    await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});

    const v1 = await db.getArchivedRecord(createdRecord.recordId, 1);
    const v2 = await db.getArchivedRecord(createdRecord.recordId, 2);

    expect(v1.data).toEqual("test-data");
    expect(v2.data).toEqual("updated-data");
  });

  it("should throw an error when retrieving a nonexistent version of an existing record", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    const promise = db.getArchivedRecord(createdRecord.recordId, 2);

    await expect(promise).rejects.toEqual(new Error('Record 1 Version 2 does not exist.'));
  });

  it("should not list a record twice when record has multiple versions", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });
    await db.updateRecord(createdRecord.recordId, 1, { data: "updated-data"});

    const records = await db.listRecords();

    expect(records.length).toEqual(1);
    expect(records[0].data).toEqual('updated-data');
  });

  it("should list 1 entry after entry is created in a database with a nested folder", async () => {
    const nestedDb = new JsonDatabase<{ data: string }>('tmp/tmp2/tmp3');
    try {
      await nestedDb.createRecord({ data: "test-data" });

      const records = await nestedDb.listRecords();

      expect(records.length).toEqual(1);
      expect(records[0].data).toEqual("test-data");
    } finally {
      await nestedDb.shutdown();
      await remove('tmp/tmp2');
    }
  });

  it("should save/retrieve a nested data type", async () => {
    type NewType = {
      a: {
        b: string
      }
    }
    const newDb = new JsonDatabase<NewType>('tmp/tmp1');
    try {
      await newDb.createRecord({ a: { b: "test-data" } });

      const records = await newDb.listRecords();

      expect(records.length).toEqual(1);
      expect(records[0].a.b).toEqual("test-data");
    } finally {
      await newDb.shutdown();
      await remove('tmp/tmp1');
    }
  });

  it("should maintain original createdAt/modifiedAt if provided during creation time (mainly for data migration purposes)", async () => {
    const createdAt = new Date(12345);
    const updatedAt = new Date(45678);

    const createdRecord = await db.createRecord(<{ data: string} & Partial<DbRecord>>{
      data: "test-data",
      createdAt: createdAt,
      modifiedAt: updatedAt,
    });
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(createdRecord.createdAt).toEqual(createdAt);
    expect(createdRecord.modifiedAt).toEqual(updatedAt);
    expect(retrievedRecord.createdAt).toEqual(createdAt);
    expect(retrievedRecord.modifiedAt).toEqual(updatedAt);
  });

  it("should not overwrite db-maintained fields during creation time", async () => {
    // no setup

    const createdRecord = await db.createRecord(<{ data: string} & Partial<DbRecord>>{
      data: "test-data",
      recordId: 999,
      version: 999.
    });
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(createdRecord.recordId).toEqual(1);
    expect(createdRecord.version).toEqual(1);
    expect(retrievedRecord.recordId).toEqual(1);
    expect(retrievedRecord.version).toEqual(1);
  });

  it("should not overwrite db-maintained fields during update time", async () => {
    const mockedCreationDate = new Date(123456);
    mockedDateUtil.now.mockReturnValueOnce(mockedCreationDate);
    const createdRecord = await db.createRecord({ data: 'test-data' });
    const mockedModifiedDate = new Date(789012);
    mockedDateUtil.now.mockReturnValueOnce(mockedModifiedDate);

    const updatedRecord = await db.updateRecord(createdRecord.recordId, createdRecord.version, <{ data: string} & Partial<DbRecord>>{
      data: "test-data2",
      recordId: 999,
      version: 999,
      modifiedAt: new Date(1),
      createdAt: new Date(1)
    });
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(updatedRecord.recordId).toEqual(1);
    expect(updatedRecord.version).toEqual(2);
    expect(updatedRecord.createdAt).toEqual(mockedCreationDate);
    expect(updatedRecord.modifiedAt).toEqual(mockedModifiedDate);
    expect(retrievedRecord.recordId).toEqual(1);
    expect(retrievedRecord.version).toEqual(2);
    expect(retrievedRecord.createdAt).toEqual(mockedCreationDate);
    expect(retrievedRecord.modifiedAt).toEqual(mockedModifiedDate);
  });

  it("should not update a record when updating a record with identical data", async () => {
    const createdRecord = await db.createRecord({ data: "test-data" });

    const updatedRecord = await db.updateRecord(createdRecord.recordId, 1, { data: "test-data"});
    const retrievedRecord = await db.getRecord(createdRecord.recordId);

    expect(updatedRecord.version).toEqual(1);
    expect(retrievedRecord.version).toEqual(1);
  });

  it("should prevent asynchronous record creations from clobbering each other", async () => {
    const promise1 = db.createRecord({ data: "test-data1" });
    const promise2 = db.createRecord({ data: "test-data2" });
    await Promise.all([promise1, promise2]);

    const records = await db.listRecords();

    expect(records.length).toEqual(2);
    expect(records[0].data).toEqual("test-data1");
    expect(records[1].data).toEqual("test-data2");
  });

});

function createDb(): JsonDatabase<{ data: string }> {
  return new JsonDatabase<{ data: string }>(dbPath);
}
