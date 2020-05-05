import { Balance } from "../../balance/balance-model";
import { saveBalance } from "../../balance/balance-repository";

export async function saveBalances(balances: Balance[]) {
  await Promise.all(balances.map(balance => saveBalance(balance)));
}
