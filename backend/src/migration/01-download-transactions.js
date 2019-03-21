const plaid = require('plaid');
const moment = require('moment');
const fs = require('fs');

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments['development'],
  {
    version: '2018-05-22'
  }
);

async function downloadTransactions() {
  await downloadTransactionsForMonth('2018', '08');
  await downloadTransactionsForMonth('2018', '09');
  await downloadTransactionsForMonth('2018', '10');
  await downloadTransactionsForMonth('2018', '11');
  await downloadTransactionsForMonth('2018', '12');
  await downloadTransactionsForMonth('2019', '01');
  await downloadTransactionsForMonth('2019', '02');
  await downloadTransactionsForMonth('2019', '03');
};

async function downloadTransactionsForMonth(year, month) {
  const discoverTransactions = await getTransactions(process.env.DISCOVER_ACCESS_KEY, year, month);
  const fccuTransactions = await getTransactions(process.env.FCCU_ACCESS_KEY, year, month);
  if (discoverTransactions.length === 250 || fccuTransactions.length === 250) {
    throw 'Too many transactions!';
  }
  const all = discoverTransactions.transactions.concat(fccuTransactions.transactions);

  fs.writeFileSync(`./all-transactions-${year}-${month}.json`, JSON.stringify(all, null, 2));
};

function getTransactions(accessKey, year, month) {
  const startDate = `${year}-${month}-01`;
  const endDate = moment(startDate).add(1, 'months').date(1).subtract(1, 'days').format('YYYY-MM-DD');

  return client.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  });
}

downloadTransactions()
  .catch((e) => {
    console.log(e);
  });
