import BalanceModel from '../db/balance';

export async function saveBalances(balances) {
  await Promise.all(balances.map(balance => {
    return (new BalanceModel(balance)).save();
  }));
};
