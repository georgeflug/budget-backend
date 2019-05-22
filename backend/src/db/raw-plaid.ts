import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const rawPlaidSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  data: Schema.Types.Mixed
});

export default mongoose.model('RawPlaid', rawPlaidSchema);
