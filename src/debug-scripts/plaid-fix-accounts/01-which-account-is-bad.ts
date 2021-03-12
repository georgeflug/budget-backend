import * as plaid from 'plaid'
import moment = require("moment");

const client = new plaid.Client(
    process.env.PLAID_CLIENT_ID as string,
    process.env.PLAID_SECRET as string,
    process.env.PLAID_PUBLIC_KEY as string,
    plaid.environments['development'],
    {
      version: '2018-05-22'
    }
);

async function downloadTransactions() {
  await getTransactions(process.env.DISCOVER_ACCESS_KEY as string)
      .then(data => {
        console.log("Downloaded Discover data successfully: " + data.transactions.length);
      })
      .catch(err => {
        if (err.error_code === 'ITEM_LOGIN_REQUIRED') {
          console.log("Discover Account needs to relogin");
        } else {
          console.log("Unexpected error for Discover account:");
          console.dir(err);
        }
      });

  await getTransactions(process.env.FCCU_ACCESS_KEY as string)
      .then(data => {
        console.log("Downloaded First Community data successfully: " + data.transactions.length);
      })
      .catch(err => {
        if (err.error_code === 'ITEM_LOGIN_REQUIRED') {
          console.log("First Community account needs to relogin");
        } else {
          console.log("Unexpected error for First Community account:");
          console.dir(err);
        }
      });
}

function getTransactions(accessKey) {
  const startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  return client.getTransactions(accessKey, startDate, endDate, {
    count: 250,
    offset: 0,
  });
}

downloadTransactions()
    .catch((e) => {
      console.log(e);
    });
