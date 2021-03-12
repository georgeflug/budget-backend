import {UnsavedBalance} from "../../balance/balance-model";
import {saveBalance} from "../../balance/balance-service";

export async function saveBalances(balances: UnsavedBalance[]): Promise<void> {
  await Promise.all(balances.map(balance => saveBalance(balance)));
}
