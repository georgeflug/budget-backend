// temporary code to have typescript recognize this file as a module
export { };

var express = require('express');
var router = express.Router();
import { Transaction, TransactionDbModel } from '../db/transaction';
const moment = require('moment');

router.route('/transactions')
  .post(function (req, res, next) {
    var transaction = new TransactionDbModel(req.body);
    verifySplits(transaction);
    transaction.save(function (err) {
      returnTheThing(res, err, transaction);
    });
  })
  .get(function (req, res, next) {
    const query = req.query.startingAt ? { updatedAt: { $gt: moment(req.query.startingAt).toDate() } } : {};
    TransactionDbModel.find(query, function (err, transactions) {
      returnTheThing(res, err, transactions);
    });
  });

router.route('/transactions/:id')
  .get(function (req, res, next) {
    TransactionDbModel.findById(req.params.id, function (err, transaction) {
      returnTheThing(res, err, transaction);
    });
  })
  .put(function (req, res, next) {
    var transaction = new TransactionDbModel(req.body);
    verifySplits(transaction);
    TransactionDbModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function (err, transaction) {
      returnTheThing(res, err, transaction);
    });
  })
  .delete(function (req, res, next) {
    TransactionDbModel.remove({ _id: req.params.id }, function (err) {
      if (err) {
        res.send(err);
      } else {
        res.status(204).send('');
      }
    });
  });

function verifySplits(transaction) {
  var totalSplits = transaction.splits.reduce((total, currentSplit) => total + currentSplit.amount, 0);
  var totalAmount = transaction.totalAmount;
  if (Math.abs(totalAmount - totalSplits) > 0.0001) {
    throw `Total Amount ${totalAmount} does not match sum of split amounts ${totalSplits}`;
  }
}

function returnTheThing(res, err, body) {
  if (err) {
    res.send(err);
  } else {
    res.json(body);
  }
}

module.exports = router;
