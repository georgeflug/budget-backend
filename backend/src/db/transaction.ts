import mongoose from 'mongoose';

export interface Transaction extends mongoose.Document {
  plaidId: string,
  date: Date,
  totalAmount: number,
  account: string,
  postedDate: Date,
  postedDescription: string,
  updatedAt: Date,
  pending: boolean,
  splits: TransactionSplit[], // splits will have 1 item for un-split transactions
}

export interface TransactionSplit {
  amount: number,
  budget: string,
  description: string,
}

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
  (<Transaction>this).updatedAt = new Date();
  next();
});

export const TransactionDbModel = mongoose.model<Transaction>('Transaction', TransactionSchema);
