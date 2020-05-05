const express = require("express");
export const router = express.Router();
import { Transaction } from "./transaction-model";
import * as repository from "./transaction-repository";

router.route("/transactions")
  .post(async function(req, res) {
    const transaction = getTransactionView(req.body);
    verifySplits(transaction);
    const result = await repository.saveTransaction(transaction);
    res.json(result);
  })
  .get(async function(req, res) {
    const results = await (req.query.startingAt ? repository.listTransactionsAfter(req.query.startingAt) : repository.listTransactions());
    res.json(results);
  });


router.route("/transactions/:id")
  .get(async function(req, res) {
    const result = await repository.findTransactionById(req.params.id);
    res.json(result);
  })
  .put(async function(req, res) {
    const transaction = getTransactionView(req.body);
    verifySplits(transaction);
    const result = await repository.updateTransactionById(req.params.id, transaction);
    res.json(result);
  })
  .delete(async function(req, res) {
    await repository.deleteTransactionById(req.params.id);
    res.status(204).body("");
  });

function getTransactionView(body: any): Transaction {
  return {
    account: body.account,
    date: body.date,
    pending: body.pending,
    plaidId: body.plaidId,
    postedDate: body.postedDate,
    postedDescription: body.postedDescription,
    splits: body.splits,
    totalAmount: body.totalAmount,
    updatedAt: body.updatedAt
  };
}

function verifySplits(transaction: Transaction) {
  var totalSplits = transaction.splits.reduce((total, currentSplit) => total + currentSplit.amount, 0);
  var totalAmount = transaction.totalAmount;
  if (Math.abs(totalAmount - totalSplits) > 0.0001) {
    throw `Total Amount ${totalAmount} does not match sum of split amounts ${totalSplits}`;
  }
}
