import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const rawPlaidSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  data: Schema.Types.Mixed
});

mongoose.model('RawPlaid', rawPlaidSchema);
export const RawPlaidModel = mongoose.model('RawPlaid');

// export {
//   schema: RawPlaidSchema,
//   model: model
// };
