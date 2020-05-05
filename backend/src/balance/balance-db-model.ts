import mongoose from 'mongoose';
import { Balance } from "./balance-model";

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

export const BalanceDbModel = mongoose.model<DbBalance>('Balance', BalanceSchema);
