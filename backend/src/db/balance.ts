// temporary code to have typescript recognize this file as a module
export { };

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceSchema = new Schema({
  accountId: String,
  balance: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  name: String
});

export default mongoose.model('Balance', BalanceSchema);
