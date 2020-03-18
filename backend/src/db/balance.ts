import mongoose from 'mongoose';

export interface Balance {
  accountId: string,
  balance: number,
  date: Date,
  name: string
}

export type DbBalance = Balance & mongoose.Document

const BalanceSchema = new mongoose.Schema({
  accountId: String,
  balance: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  name: String
});

export const BalanceDbModel = mongoose.model('Balance', BalanceSchema);
