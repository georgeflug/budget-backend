const Balance = require('../db/balance');

module.exports = async function saveBalances(balances) {
  await Promise.all(balances.map(balance => {
    return (new Balance.model(balance)).save();
  }));
};
