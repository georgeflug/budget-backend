import mongoose from "mongoose";
import { PlaidTransaction } from "../plaid/plaid-types";

export interface RawPlaid extends mongoose.Document {
  date: Date,
  data: PlaidTransaction[]
}
