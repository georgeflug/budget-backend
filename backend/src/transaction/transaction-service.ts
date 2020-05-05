const express = require("express");
export const router = express.Router();
import { Transaction } from "./transaction-model";
import * as repository from "./transaction-repository";

export async function createTransaction(transaction: Transaction) {
  verifySplits(transaction);
  await repository.saveTransaction(transaction);
}

export async function listTransactions(): Promise<Transaction[]> {
  return await repository.listTransactions();
}

export async function listTransactionsAfter(startingAt: string): Promise<Transaction[]> {
  return await repository.listTransactionsAfter(startingAt);
}

export async function findTransactionById(id: string): Promise<Transaction | null> {
  return await repository.findTransactionById(id);
}

export async function updateTransaction(id: string, transaction: Transaction) {
  verifySplits(transaction);
  return await repository.updateTransactionById(id, transaction);
}

export async function deleteTransaction(id: string) {
  await repository.deleteTransactionById(id);
}

function verifySplits(transaction: Transaction) {
  var totalSplits = transaction.splits.reduce((total, currentSplit) => total + currentSplit.amount, 0);
  var totalAmount = transaction.totalAmount;
  if (Math.abs(totalAmount - totalSplits) > 0.0001) {
    throw `Total Amount ${totalAmount} does not match sum of split amounts ${totalSplits}`;
  }
}
