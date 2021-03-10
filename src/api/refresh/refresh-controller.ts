import {Route} from "../route";
import { error } from "../../log";
import express from "express";
import {saveLatestTransactionsToDb} from "../../plaid";

const router = express.Router();

router.route("/")
  .post(async function(req, res) {
    try {
      res.json(await saveLatestTransactionsToDb());
    } catch (e) {
      error("REFRESH", "Could not refresh transactions", e);
      throw e;
    }
  });

export const refreshRoute: Route = {
  router,
  basePath: '/refresh',
}
