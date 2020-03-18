// temporary code to have typescript recognize this file as a module
export {};

import express from 'express';
import moment from 'moment';

var router = express.Router();
import {DbBalance, BalanceDbModel} from '../db/balance';

router.route('/balances')
    .get(function (req, res) {
      const query = req.query.startingAt ? {date: {$gte: moment(req.query.startingAt)}} : {};
      BalanceDbModel.find(query, function (err: Error, balances: DbBalance[]) {
        returnTheThing(res, err, balances);
      });
    });

function returnTheThing(res: express.Response, err: Error, body: any) {
  if (err) {
    res.send(err);
  } else {
    res.json(body);
  }
}

module.exports = router;
