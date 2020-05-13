import { UnsavedBalance } from "../../balance/balance-model";
import { saveBalance } from "../../balance/balance-service";

export async function saveBalances(balances: UnsavedBalance[]) {
  await Promise.all(balances.map(balance => saveBalance(balance)));
}
