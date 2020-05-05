import { Balance } from "./balance-model";
import { BalanceDbModel } from "./balance-db-model";
import moment from "moment";

export async function saveBalance(balance: Balance) {
  const balanceDbModel = new BalanceDbModel(balance);
  await balanceDbModel.save()
}

export async function listBalances(): Promise<Balance[]> {
  return await BalanceDbModel.find({}).exec();
}

export async function listBalancesAfter(startingAt: string): Promise<Balance[]> {
  const query = {
    date: {
      $gte: moment(startingAt)
    }
  };
  return await BalanceDbModel.find(query).exec();
}
