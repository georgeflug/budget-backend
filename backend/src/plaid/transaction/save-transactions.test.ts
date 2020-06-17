import { TransactionRepository } from "../../transaction/transaction-repository";
import { TransactionSplit, TransactionV2, UnsavedTransactionV2 } from "../../transaction/transaction-model";
import { parseISO } from "date-fns";
import { remove } from "fs-extra";
import { TransactionService } from "../../transaction/transaction-service";
import { TransactionSaver } from "./save-transactions";
import { JsonDatabase } from "../../db/json-db";

const DB_PATH = 'tmp/save-transactions-tests';

describe("Plaid", () => {
  let db: JsonDatabase<UnsavedTransactionV2>;
  let repository: TransactionRepository;
  let service: TransactionService;
  let saver: TransactionSaver;

  const newTransaction: UnsavedTransactionV2 = createValidTransaction({
    plaidId: "111",
    totalAmount: 999888777666,
    account: "Discover",
    postedDate: parseISO("2019-01-02"),
    postedDescription: "CHOCOLATE CHOCOLAT ST LOUIS",
    pending: false,
    splits: [createValidSplit({ amount: 999888777666 })]
  });

  beforeEach(async function() {
    await remove(DB_PATH);
    db = new JsonDatabase<UnsavedTransactionV2>(DB_PATH);
    repository = new TransactionRepository(db);
    service = new TransactionService(repository);
    saver = new TransactionSaver(service);
  });

  afterEach(async () => {
    await db.shutdown();
    await remove(DB_PATH);
  });

  it("create transaction if it does not exist", async () => {
    const transaction = createValidTransaction({});

    const metrics = await saver.saveTransactions([transaction]);

    const actual = await repository.listTransactions();
    expect(actual.length).toEqual(1);
    compareTransactions(actual[0], transaction);
    expect(metrics.newRecords).toEqual(1);
    expect(metrics.updatedRecords).toEqual(0);
    expect(metrics.totalRecords).toEqual(1);
  });

  it("edit existing transaction if new one has the same plaidId", async () => {
    const existingTransaction = createValidTransaction({
      plaidId: "111",
      totalAmount: 1,
      account: "Discover2",
      postedDate: parseISO("2019-12-31"),
      postedDescription: "pending transaction",
      splits: [createValidSplit({ amount: 1 })]
    });
    const expectedTransaction: UnsavedTransactionV2 = {
      plaidId: "111",
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription,
      pending: false,
      splits: [createValidSplit({ amount: newTransaction.totalAmount })]
    };
    await repository.saveTransaction(existingTransaction);

    const metrics = await saver.saveTransactions([newTransaction]);

    const actual = await repository.listTransactions();
    expect(actual.length).toEqual(1);
    compareTransactions(actual[0], expectedTransaction);
    expect(metrics.newRecords).toEqual(0);
    expect(metrics.updatedRecords).toEqual(1);
    expect(metrics.totalRecords).toEqual(1);
  });

  it("edit existing transaction does not clobber user-entered data (budget and description) even if amount changed", async () => {
    const existingTransaction = createValidTransaction({
      plaidId: "111",
      totalAmount: 1,
      account: "Discover2",
      postedDate: parseISO("2019-12-31"),
      postedDescription: "pending transaction",
      splits: [{
        amount: 1,
        budget: "Richie",
        description: "Richie spent a dollar"
      }]
    });
    const expectedTransaction: UnsavedTransactionV2 = {
      plaidId: "111",
      totalAmount: newTransaction.totalAmount,
      account: newTransaction.account,
      postedDate: newTransaction.postedDate,
      postedDescription: newTransaction.postedDescription,
      pending: false,
      splits: [
        existingTransaction.splits[0],
        createValidSplit({
          amount: newTransaction.totalAmount - existingTransaction.totalAmount
        })
      ]
    };
    await repository.saveTransaction(existingTransaction);

    const metrics = await saver.saveTransactions([newTransaction]);

    const actual = await repository.listTransactions();
    expect(actual.length).toEqual(1);
    compareTransactions(actual[0], expectedTransaction);
    expect(metrics.newRecords).toEqual(0);
    expect(metrics.updatedRecords).toEqual(1);
    expect(metrics.totalRecords).toEqual(1);
  });

  function compareTransactions(actualTransaction: TransactionV2, expectedTransaction: UnsavedTransactionV2) {
    expect(actualTransaction.plaidId).toEqual(expectedTransaction.plaidId);
    expect(actualTransaction.totalAmount).toEqual(expectedTransaction.totalAmount);
    expect(actualTransaction.account).toEqual(expectedTransaction.account);
    expect(actualTransaction.postedDescription).toEqual(expectedTransaction.postedDescription);
    expect(actualTransaction.postedDate).toEqual(expectedTransaction.postedDate);
    expect(actualTransaction.splits).toEqual(expectedTransaction.splits);
  }
});

function createValidTransaction(transaction: Partial<UnsavedTransactionV2>): UnsavedTransactionV2 {
  return {
    account: "account1",
    pending: false,
    plaidId: "plaidId1",
    postedDate: new Date(),
    postedDescription: "postedDescription",
    splits: [],
    totalAmount: 0,
    ...transaction
  };
}

function createValidSplit(split: Partial<TransactionSplit>): TransactionSplit {
  return {
    amount: 0,
    budget: "",
    description: "",
    ...split
  };
}
