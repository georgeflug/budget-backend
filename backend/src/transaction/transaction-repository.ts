import { TransactionDbModel } from "./transaction-db-model";
import { Transaction } from "./transaction-model";
const moment = require("moment");

export async function saveTransaction(transaction: Transaction) {
  const transactionDbModel = new TransactionDbModel(transaction);
  await transactionDbModel.save();
}

export async function listTransactions(): Promise<Transaction[]> {
  return await TransactionDbModel.find({}).exec();
}

export async function listTransactionsAfter(startingAt: string): Promise<Transaction[]> {
  const query = {
    updatedAt: {
      $gt: moment(startingAt).toDate()
    }
  };
  return await TransactionDbModel.find(query).exec();
}

export async function findTransactionById(id: string): Promise<Transaction | null> {
  return await TransactionDbModel.findById(id).exec();
}

export async function findTransactionByPlaidId(plaidId: string): Promise<Transaction | null> {
  return await TransactionDbModel.findOne({ plaidId: plaidId }).exec();
}

export async function findPendingTransaction(account: string, postedDate: Date, amount: number) {
  return await TransactionDbModel.findOne({
    pending: true,
    totalAmount: amount,
    postedDate: postedDate,
    account: account
  }).exec();
}

export async function updateTransactionById(id: string, transaction: Transaction) {
  await TransactionDbModel.findOneAndUpdate({ _id: id }, transaction, { new: true }).exec();
}

export async function updateTransaction(transaction: Transaction) {
  if ((transaction as any).save) {
    await (transaction as any).save()
  } else if ((transaction as any)._id) {
    await TransactionDbModel.findOneAndUpdate({ _id: (transaction as any)._id }, transaction, { new: true }).exec();
  }
}

export async function deleteTransactionById(id: string) {
  await TransactionDbModel.remove({ _id: id }).exec();
}

export async function deleteTransaction(transaction: Transaction) {
  if ((transaction as any).remove) {
    await (transaction as any).remove()
  } else if ((transaction as any)._id) {
    await TransactionDbModel.remove({ _id: (transaction as any)._id }).exec();
  }
}
