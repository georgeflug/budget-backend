var express = require('express');
var router = express.Router();
const downloader = require('../plaid/index');
const log = require('../log');

router.route('/refresh')
  .post(function (req, res, next) {
    downloader.saveLatestTransactionsToDb().then(val => res.json(val))
      .catch(ex => {
        log.error("REFRESH", "Could not refresh transactions", ex);
        res.json({
          "error": ex.stack || ex
        });
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
