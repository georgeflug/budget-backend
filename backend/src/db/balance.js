const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceSchema = new Schema({
  accountId: String,
  balance: Number,
  date: Date,
  name: String
});

mongoose.model('Balance', BalanceSchema);
const model = mongoose.model('Balance');

module.exports = {
  schema: BalanceSchema,
  model: model
};
