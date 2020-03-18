// temporary code to have typescript recognize this file as a module
export {};

var express = require('express');
var router = express.Router();
const downloader = require('../plaid/index');
import {error} from '../log';

router.route('/refresh')
    .post(function (req, res) {
      downloader.saveLatestTransactionsToDb().then(val => res.json(val))
          .catch(ex => {
            error("REFRESH", "Could not refresh transactions", ex);
            res.json({
              "error": ex.stack || ex
            });
          });
    });

module.exports = router;
