const plaidData = require('./all-transactions.json');
let sheetsData = require('./google-sheets.json').rows;
const moment = require('moment');

// ignore initial carryover
sheetsData.splice(0, 3);

plaidData.forEach(data => {
  data.moment = moment(data.date);
});

const unfound = [];
let largestDateGap = 0;
let largestDateItem = {};

const originalSheetCount = sheetsData.length;
// sheetsData = sheetsData.filter(row => row.amount !== -1);
// const pendingTransactionCount = originalSheetCount - sheetsData.length;
const originalPlaidCount = plaidData.length;

sheetsData.forEach((row) => {
  const rowDate = moment(row.postedDate || row.date);
  const rowAmount = -row.amount;

  if (rowAmount === 1) {
    unfound.push(row);
    return;
  }

  const plaidItem = plaidData.findIndex(data => {
    return data.amount === rowAmount && data.moment.isSame(rowDate);
  });

  if (plaidItem !== -1) {
    plaidData.splice(plaidItem, 1);
  } else {

    const plaidItemAmountOnly = plaidData.findIndex(data => {
      return data.amount === rowAmount;
    });

    if (plaidItemAmountOnly !== -1) {
      const theItem = plaidData[plaidItemAmountOnly];
      plaidData.splice(plaidItemAmountOnly, 0);
      const dateGap = theItem.moment.diff(rowDate, 'days');
      if (dateGap > largestDateGap) {
        largestDateGap = dateGap;
        largestDateItem = {
          sheets: row,
          plaid: theItem
        };
      }
    } else {
      unfound.push(row);
    }
  }
});

console.log(`Sheets count: ${sheetsData.length}`);
console.log(`Plaid count: ${originalPlaidCount}`);
console.log(`Matched count: ${sheetsData.length - unfound.length}`);
console.log(`Unmatched count: ${unfound.length}`);
// console.log(`Pending count: ${pendingTransactionCount}`);

console.log(`Largest date gap: ${largestDateGap}`);
// console.log(`Largest date gap item: ${JSON.stringify(largestDateItem, null, 2)}`);

const interestingOnes = unfound.filter(row => (row.budget && row.budget !== 'Gas') || row.description);
console.log(`Records to be manually fixed: ${interestingOnes.length}`);
console.log(Object.keys(interestingOnes[0]).join('|'))
interestingOnes.forEach(row => console.log(Object.values(row).join('|')));
// console.log(`Unmatched: ${JSON.stringify(unfound[1], null, 2)}`);

// console.log('unmatched: ' + JSON.stringify(unfound, null, 2));
