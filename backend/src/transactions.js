const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var express = require('express');
var router = express.Router();

var TransactionSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  budget: String,
  description: String,
  account: String,
  postedDate: Date,
  postedDescription: String,
  transactionType: String,
  status: String,
});

mongoose.model('Transaction', TransactionSchema);
var Transaction = mongoose.model('Transaction');

router.route('/transactions')
  .post(function (req, res, next) {
    var transaction = new Transaction(req.body);
    transaction.save(function (err) {
      returnTheThing(res, err, transaction);
    });
  })
  .get(function (req, res, next) {
    Transaction.find({}, function(err, transactions) {
      returnTheThing(res, err, transactions);
    });
  });

router.route('/transactions/:id')
  .get(function (req, res, next) {
    Transaction.findById(req.params.id, function(err, transaction) {
      returnTheThing(res, err, transaction);
    });
  })
  .put(function (req, res, next) {
    Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, function(err, transaction) {
      returnTheThing(res, err, transaction);
    });
  })
  .delete(function (req, res, next) {
    Transaction.remove({ _id: req.params.id }, function(err, transaction) {
      if (err) {
        res.send(err);
      } else {
        res.status(204).send('');
      }
    });
  });

function returnTheThing (res, err, body) {
  if (err) {
    res.send(err);
  } else {
    res.json(body);
  }
}

module.exports = router;
