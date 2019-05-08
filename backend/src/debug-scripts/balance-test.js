const getBalances = require('../plaid/download-balances');

getBalances().then(balances => {
  console.log(JSON.stringify(balances, null, 2));
});
