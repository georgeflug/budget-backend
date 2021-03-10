import express from "express";
import { getBalances } from "./balance-service";
import { parseISO } from "date-fns";
import {Route} from "../api/route";

const router = express.Router();

router.route("/")
  .get(async function(req, res) {
    const startDate = req.query.startingAt ? parseISO(req.query.startingAt) : undefined;
    const balances = await getBalances(startDate);
    res.json(balances);
  });

export const balanceRoute: Route = {
  router,
  basePath: '/balances',
}
