const express = require('express');
export const router = express.Router();
const downloader = require('../plaid/index');
import {error} from '../log';

router.route('/refresh')
    .post(async function (req, res) {
      try {
        res.json(await downloader.saveLatestTransactionsToDb());
      } catch (e) {
        error("REFRESH", "Could not refresh transactions", e);
        throw e;
      }
    });
