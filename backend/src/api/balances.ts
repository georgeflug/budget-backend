// temporary code to have typescript recognize this file as a module
export {};

var express = require('express');
var router = express.Router();
const Balance = require('../db/balance');
const moment = require('moment');

router.route('/balances')
  .get(function (req, res, next) {
    const query = req.query.startingAt ? { date: { $gte: moment(req.query.startingAt) } } : {};
    Balance.model.find(query, function (err, transactions) {
      returnTheThing(res, err, transactions);
    });
  });

function returnTheThing(res, err, body) {
  if (err) {
    res.send(err);
  } else {
    res.json(body);
  }
}

module.exports = router;
