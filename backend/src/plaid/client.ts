// temporary code to have typescript recognize this file as a module
export {};

const plaid = require('plaid');

export const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments['development'],
  {
    version: '2018-05-22'
  }
);
