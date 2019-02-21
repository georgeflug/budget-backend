var express = require('express');
var router = express.Router();
const downloadAndSaveTransactions = require('./index');

router.route('/plaid')
  .get(async function (req, res, next) {
    res.send(await downloadAndSaveTransactions());
  });

module.exports = router;
