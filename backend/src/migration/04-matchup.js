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
const matches = [];

sheetsData.forEach((row) => {
  const rowDate = moment(row.postedDate || row.date);
  const rowAmount = -row.amount;

  if (rowAmount === 1) {
    unfound.push(row);
    return;
  }
  if (!row.budget) {
    return;
  }

  // if (rowAmount === 2.99) {
  //   console.log(JSON.stringify(row, null, 2));
  //   const foundStuff = plaidData.filter(data => {
  //     return data.amount === rowAmount;
  //   });
  //   console.log(JSON.stringify(foundStuff, null, 2));
  //   console.log(Math.abs(foundStuff[1].moment.diff(rowDate, 'days')))

  //   const maybeFoundStuff = plaidData.filter(data => {
  //     return data.amount === rowAmount && (Math.abs(data.moment.diff(rowDate, 'days')) < 5);
  //   });
  //   console.log(JSON.stringify(maybeFoundStuff, null, 2));

  //   process.exit();
  // }

  let plaidItem = plaidData.findIndex(data => {
    return data.amount === rowAmount && data.moment.isSame(rowDate) && !data.budget;
  });
  if (plaidItem === -1) {
    plaidItem = plaidData.findIndex(data => {
      return data.amount === rowAmount && (Math.abs(data.moment.diff(rowDate, 'days')) < 5) && !data.budget;
    });
  }

  if (plaidItem !== -1) {
    const theItem = plaidData[plaidItem];
    // plaidData.splice(plaidItem, 1)
    theItem.budget = row.budget;
    theItem.description = row.description;
    matches.push(theItem);
  } else {

    // const plaidItemAmountOnly = plaidData.findIndex(data => {
    //   return data.amount === rowAmount;
    // });

    // if (plaidItemAmountOnly !== -1) {
    //   const theItem = plaidData[plaidItemAmountOnly];
    //   plaidData.splice(plaidItem, 1);
    //   matches.push({ sheets: row, plaid: theItem });

    //   const dateGap = theItem.moment.diff(rowDate, 'days');
    //   if (dateGap > largestDateGap) {
    //     largestDateGap = dateGap;
    //     largestDateItem = {
    //       sheets: row,
    //       plaid: theItem
    //     };
    //   }
    // } else {
    unfound.push(row);
    // }
  }
});

// console.log(`Sheets count: ${sheetsData.length}`);
// console.log(`Plaid count: ${originalPlaidCount}`);
// console.log(`Matched count: ${sheetsData.length - unfound.length}`);
// console.log(`Unmatched count: ${unfound.length}`);
// // console.log(`Pending count: ${pendingTransactionCount}`);

// console.log(`Largest date gap: ${largestDateGap}`);
// // console.log(`Largest date gap item: ${JSON.stringify(largestDateItem, null, 2)}`);

// const interestingOnes = unfound.filter(row => (row.budget && row.budget !== 'Gas') || row.description);
// console.log(`Records to be manually fixed: ${interestingOnes.length}`);
// console.log(Object.keys(interestingOnes[0]).join('|'))
const header = Object.keys(matches[0]).join('|');
const data = matches.map(row => Object.values(row).join('|'));
// interestingOnes.forEach(row => console.log(Object.values(row).join('|')));
// console.log(`Unmatched: ${JSON.stringify(unfound[1], null, 2)}`);

// console.log(`Matched items: ${matches.length}`);
// const header = `Sheets Date|Sheets Posted Date|Plaid Date|Sheet Amount|Plaid Amount|Sheets Description|Sheets Budget|Sheets Posted Description|Plaid Description`;
// const data = matches
//   .filter((match) => !!match.sheets.budget)
//   .map((match) => {
//     return [
//       match.sheets.date,
//       match.sheets.postedDate,
//       match.plaid.date,
//       match.sheets.amount,
//       match.plaid.amount,
//       match.sheets.description,
//       match.sheets.budget,
//       match.sheets.postedDescription,
//       match.plaid.name,
//     ].join('|');
//   });
// console.log('unmatched: ' + JSON.stringify(unfound, null, 2));
// clipboard(header + '\n' + data.join('\n'));
// console.log('Interesting items saved to clipboard');

// function clipboard(data) {
//   var proc = require('child_process').spawn('pbcopy');
//   proc.stdin.write(data); proc.stdin.end();
// }

require('../db/db').initDb().then(async function () {
  const saveTransactions = require('../plaid/save-transactions');

  console.log("Adapting transactions...");
  const adaptedTransactions = await adaptTransactions(plaidData);
  console.log("Saving transactions...");
  const results = await saveTransactions(adaptedTransactions);
  console.log("Complete!\nMetrics:");
  console.dir(results);
  process.exit(0);

  // {
  //   "account_id": "DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w",
  //   "account_owner": null,
  //   "amount": 24.72,
  //   "category": [
  //     "Shops",
  //     "Hardware Store"
  //   ],
  //   "category_id": "19030000",
  //   "date": "2018-08-31",
  //   "iso_currency_code": "USD",
  //   "location": {
  //     "address": null,
  //     "city": null,
  //     "lat": null,
  //     "lon": null,
  //     "state": null,
  //     "store_number": null,
  //     "zip": null
  //   },
  //   "name": "Home Depot",
  //   "payment_meta": {
  //     "by_order_of": null,
  //     "payee": null,
  //     "payer": null,
  //     "payment_method": null,
  //     "payment_processor": null,
  //     "ppd_id": null,
  //     "reason": null,
  //     "reference_number": null
  //   },
  //   "pending": false,
  //   "pending_transaction_id": null,
  //   "transaction_id": "a5bARdV4pQHBak1BZPorIrw5L0nxjyFZg8oVv",
  //   "transaction_type": "place",
  //   "unofficial_currency_code": null
  // },

});

const ACCOUNT_MAP = {
  'o3d3dPnELRtY7gEPPaBVsbZkDqJeQLCB680A5': 'Discover',
  'DoQmRxwVbDTw4X5wbBNyTEZ7kDN9ZRfZE880w': 'Checking',
  '1EzgJnaKqxFD8R9D5pdXug0qLPKx0XHmJXXEY': 'Savings'
};

function adaptPlaidTransactionForDb(transactions) {
  return transactions.map(transaction => {
    return {
      date: transaction.date,
      totalAmount: transaction.amount,
      account: ACCOUNT_MAP[transaction.account_id],
      postedDate: transaction.date,
      postedDescription: transaction.name,
      plaidId: transaction.transaction_id,
      splits: [{
        amount: transaction.amount,
        budget: transaction.budget,
        description: transaction.description
      }]
    };
  });
};
