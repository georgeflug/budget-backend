import * as plaid from 'plaid';

export const plaidClient = new plaid.Client(
  process.env.PLAID_CLIENT_ID,
  process.env.PLAID_SECRET,
  process.env.PLAID_PUBLIC_KEY,
  plaid.environments['development'],
  {
    version: '2018-05-22'
  }
);
