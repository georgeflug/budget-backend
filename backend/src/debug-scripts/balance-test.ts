const getBalances = require('../plaid/balance/download-balances');

getBalances().then(balances => {
  console.log(JSON.stringify(balances, null, 2));
});
