import express from 'express';
import {getBalances} from './balance-service';

export const router = express.Router();

router.route('/balances')
    .get(async function (req, res) {
      const balances = await getBalances(req.query.startingAt);
      res.json(balances);
    });
