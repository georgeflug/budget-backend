const moment = require('moment');

const currDate = moment('2018-08-01');
const endDate = moment('2019-03-01');

let transactions = [];
while (currDate.isSameOrBefore(endDate)) {
  const file = require(`./all-transactions-${currDate.format('YYYY-MM')}.json`);
  console.log(file.length);
  transactions = transactions.concat(file);
  currDate.add(1, 'months');
}

const orderedTransactions = transactions.sort((a, b) => {
  const aDate = moment(a.date);
  const bDate = moment(b.date);
  if (aDate.isSame(bDate)) {
    return 0;
  } else if (aDate.isBefore(bDate)) {
    return -1;
  }
  return 1;
});
require('fs').writeFileSync('all-transactions.json', JSON.stringify(orderedTransactions, null, 2));
