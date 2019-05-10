// temporary code to have typescript recognize this file as a module
export {};

const plaidClient = require('./client');
const moment = require('moment');

module.exports = async function downloadBalances() {
  const discoverBalances = await getBalance(process.env.DISCOVER_ACCESS_KEY);
  const fccuBalances = await getBalance(process.env.FCCU_ACCESS_KEY);
  return discoverBalances.concat(fccuBalances);
};

async function getBalance(accessKey) {
  const balances = await plaidClient.getBalance(accessKey);
  const accounts = balances.accounts;
  return accounts.map(account => {
    return {
      accountId: account.account_id,
      balance: account.balances.current,
      date: moment(),
      name: account.name
    };
  });
}
