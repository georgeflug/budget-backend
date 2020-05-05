import { listBalances, listBalancesAfter } from "./balance-repository";
import { Balance } from "./balance-model";

export async function getBalances(startingAt: string): Promise<Balance[]> {
  if (startingAt) {
    return await listBalances();
  } else {
    return await listBalancesAfter(startingAt);
  }
}
