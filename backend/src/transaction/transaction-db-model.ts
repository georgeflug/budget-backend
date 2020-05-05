import mongoose from 'mongoose';
import { Transaction } from "./transaction-model";

const SplitTransactionSchema = new mongoose.Schema({
  amount: Number,
  budget: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});

const TransactionSchema = new mongoose.Schema({
  plaidId: String,
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: Number,
  account: String,
  postedDate: Date,
  postedDescription: String,
  updatedAt: Date,
  pending: Boolean,
  splits: [SplitTransactionSchema], // splits will have 1 item for un-split transactions
});

TransactionSchema.pre('save', function (next) {
  (<DbTransaction>this).updatedAt = new Date();
  next();
});

export type DbTransaction = Transaction & mongoose.Document;

export const TransactionDbModel = mongoose.model<DbTransaction>('Transaction', TransactionSchema);
