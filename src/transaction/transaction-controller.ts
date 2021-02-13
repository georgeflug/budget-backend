import {parseISO} from "date-fns";
import {getTransactionService} from "./transaction-service-instance";

const express = require("express");
export const router = express.Router();

const service = getTransactionService();

router.route("/transactions")
  .get(async function (req, res) {
    const results = await (req.query.startingAt ? service.listTransactionsAfter(parseISO(req.query.startingAt)) : service.listTransactions());
    res.json(results);
  });

router.route("/transactions/:id")
  .get(async function (req, res) {
    const result = await service.findTransactionById(parseInt(req.params.id));
    res.json(result);
  })
  .put(async function (req, res) {
    const result = await service.updateTransactionSplits(parseInt(req.params.id), parseInt(req.body.version), req.body.splits);
    res.json(result);
  });