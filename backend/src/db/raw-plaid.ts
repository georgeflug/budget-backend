import mongoose from 'mongoose';
import {PlaidTransaction} from '../plaid/plaid-types';

export interface RawPlaid extends mongoose.Document {
  date: Date,
  data: PlaidTransaction[]
}

const rawPlaidSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  data: mongoose.Schema.Types.Mixed
});

export const RawPlaidDbModel = mongoose.model('RawPlaid', rawPlaidSchema);
