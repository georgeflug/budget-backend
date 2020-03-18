import express from 'express';
import moment from 'moment';

export const router = express.Router();
import {DbBalance, BalanceDbModel} from '../../db/balance';

export async function getBalances(startingAt: moment.Moment): Promise<DbBalance[]> {
  const query = !startingAt ? {} : {
    date: {
      $gte: moment(startingAt)
    }
  };
  return await BalanceDbModel.find(query).exec();
}
