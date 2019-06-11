// temporary code to have typescript recognize this file as a module
export { };

import mongoose from 'mongoose';

export interface Transaction extends Document {
  plaidId: String,
  date: Date,
  totalAmount: Number,
  account: String,
  postedDate: Date,
  postedDescription: String,
  updatedAt: Date,
  pending: Boolean,
  splits: TransactionSplit[], // splits will have 1 item for un-split transactions
};

export interface TransactionSplit {
  amount: Number,
  budget: String,
  description: String,
};

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
  (<Transaction>this).updatedAt = Date.now();
  next();
});

export const TransactionDbModel = mongoose.model<Transaction>('Transaction', TransactionSchema);
