// temporary code to have typescript recognize this file as a module
export { };

import mongoose from 'mongoose';

export interface Balance extends mongoose.Document {
  accountId: string,
  balance: Number,
  date: Date,
  name: string
}

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
