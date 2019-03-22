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
  splits: [SplitTransactionSchema], // splits will have 1 item for un-split transactions
});

mongoose.model('Transaction', TransactionSchema);
const model = mongoose.model('Transaction');

module.exports = {
  schema: TransactionSchema,
  model: model
};
