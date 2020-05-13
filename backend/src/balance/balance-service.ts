import { Balance, UnsavedBalance } from "./balance-model";
import { JsonDatabase } from "../db/json-db";
import { SmartDate } from "../util/smart-date";

const db = new JsonDatabase<UnsavedBalance>('data/balances');

export async function getBalances(startingAt?: Date): Promise<Balance[]> {
  const balances = await db.listRecords();
  if (startingAt) {
    const smartStartingAt = SmartDate.of(startingAt);
    return balances.filter(balance => smartStartingAt.isSameOrBefore(balance.modifiedAt));
  } else {
    return balances;
  }
}

export async function saveBalance(balance: UnsavedBalance): Promise<Balance> {
  return db.createRecord(balance);
}
