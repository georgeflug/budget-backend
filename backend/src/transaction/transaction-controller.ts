const express = require("express");
export const router = express.Router();
import { Transaction } from "./transaction-model";
import * as service from "./transaction-service";

router.route("/transactions")
  .post(async function(req, res) {
    const transaction = getTransactionView(req.body);
    const result = await service.createTransaction(transaction);
    res.json(result);
  })
  .get(async function(req, res) {
    const results = await (req.query.startingAt ? service.listTransactionsAfter(req.query.startingAt) : service.listTransactions());
    res.json(results);
  });


router.route("/transactions/:id")
  .get(async function(req, res) {
    const result = await service.findTransactionById(req.params.id);
    res.json(result);
  })
  .put(async function(req, res) {
    const transaction = getTransactionView(req.body);
    const result = await service.updateTransaction(req.params.id, transaction);
    res.json(result);
  })
  .delete(async function(req, res) {
    await service.deleteTransaction(req.params.id);
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
