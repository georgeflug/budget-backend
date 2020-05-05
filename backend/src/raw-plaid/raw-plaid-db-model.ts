import mongoose from "mongoose";
import { RawPlaid } from "./raw-plaid-model";

export type DbRawPlaid = RawPlaid & mongoose.Document;

const rawPlaidSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  data: mongoose.Schema.Types.Mixed
});

export const RawPlaidDbModel = mongoose.model<DbRawPlaid>("RawPlaid", rawPlaidSchema);
