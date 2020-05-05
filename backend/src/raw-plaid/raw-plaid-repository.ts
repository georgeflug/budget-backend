import { PlaidTransaction } from "../plaid/plaid-types";
import { RawPlaid } from "./raw-plaid-model";
import moment from "moment";
import { RawPlaidDbModel } from "./raw-plaid-db-model";

export async function saveRawPlaid(transactions: PlaidTransaction[]) {
  const rawPlaid = new RawPlaidDbModel({
    data: transactions
  });
  await rawPlaid.save();
}

export async function findRawPlaidBetween(startDate: moment.Moment, endDate: moment.Moment): Promise<RawPlaid[]> {
  const query = {
    date: {
      $gte: startDate,
      $lte: endDate
    }
  };
  return RawPlaidDbModel.find(query).exec();
}
