// temporary code to have typescript recognize this file as a module
export { };

import express from 'express';
import moment from 'moment';

var router = express.Router();
const Balance = require('../db/balance');

router.route('/balances')
  .get(function (req, res, next) {
    const query = req.query.startingAt ? { date: { $gte: moment(req.query.startingAt) } } : {};
    Balance.model.find(query, function (err: Error, transactions) {
      returnTheThing(res, err, transactions);
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
