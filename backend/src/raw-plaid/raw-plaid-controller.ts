import express from "express";
import moment from "moment";
import { findRawPlaidBetween } from "./raw-plaid-repository";

export const router = express.Router();

router.route("/raw-plaid")
  .get(async function(req, res) {
    if (!req.query.date) {
      failNoDate(res);
    } else {
      const rawPlaids = await findRawPlaidBetween(
        moment(req.query.date).hour(0).minute(0).second(0).toDate(),
        moment(req.query.date).hour(23).minute(59).second(59).toDate()
      );
      res.json(rawPlaids);
    }
  });

function failNoDate(res: express.Response) {
  res.json({
    error: "date is required"
  });
}
