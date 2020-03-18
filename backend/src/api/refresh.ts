const express = require('express');
export const router = express.Router();
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
