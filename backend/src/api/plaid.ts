const express = require('express');
export const router = express.Router();
const downloadAndSaveTransactions = require('../plaid');

router.route('/plaid')
    .get(async function (req, res) {
      res.send(await downloadAndSaveTransactions());
    });
