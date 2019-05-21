const Balance = require('../db/balance');

export async function saveBalances(balances) {
  await Promise.all(balances.map(balance => {
    return (new Balance.model(balance)).save();
  }));
};
