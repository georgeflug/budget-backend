import express from "express";
import { getBalances } from "./balance-service";
import { parseISO } from "date-fns";

export const router = express.Router();

router.route("/balances")
  .get(async function(req, res) {
    const startDate = req.query.startingAt ? parseISO(req.query.startingAt) : undefined;
    const balances = await getBalances(startDate);
    res.json(balances);
  });
