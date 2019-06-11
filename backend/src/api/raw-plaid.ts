// temporary code to have typescript recognize this file as a module
export { };

import express from 'express';
import moment from 'moment';
import { RawPlaid, RawPlaidDbModel } from '../db/raw-plaid';

const router = express.Router();
export default router;

router.route('/raw-plaid')
  .get(function (req, res, next) {
    if (!req.query.date) {
      failNoDate(res);
    } else {
      const query = {
        date: {
          $gte: moment(req.query.date).hour(0).minute(0).second(0),
          $lte: moment(req.query.date).hour(23).minute(59).second(59)
        }
      };
      RawPlaidDbModel.find(query, function (err: Error, rawTransactions: RawPlaid[]) {
        returnTheThing(res, err, rawTransactions);
      });
    }
  });

function failNoDate(res: express.Response) {
  res.json({
    error: 'date is required'
  });
}

function returnTheThing(res: express.Response, err: Error, body: any) {
  if (err) {
    res.send(err);
  } else {
    res.json(body);
  }
}
