// temporary code to have typescript recognize this file as a module
export {};

const express = require('express');
const router = express.Router();
const downloadAndSaveTransactions = require('../plaid');

router.route('/plaid')
    .get(async function (req, res) {
      res.send(await downloadAndSaveTransactions());
    });

module.exports = router;
