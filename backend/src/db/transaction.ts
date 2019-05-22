// temporary code to have typescript recognize this file as a module
export { };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SplitTransactionSchema = new Schema({
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

const TransactionSchema = new Schema({
  plaidId: String,
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: Number,
  account: String,
  postedDate: Date,
  postedDescription: String,
  lastModified: Date,
  pending: Boolean,
  splits: [SplitTransactionSchema], // splits will have 1 item for un-split transactions
});

TransactionSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

export default mongoose.model('Transaction', TransactionSchema);
