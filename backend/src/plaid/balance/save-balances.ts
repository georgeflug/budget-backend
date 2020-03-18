import {Balance, BalanceDbModel} from '../../db/balance';

export async function saveBalances(balances: Balance[]) {
  await Promise.all(balances.map(balance => {
    return (new BalanceDbModel(balance)).save();
  }));
}
