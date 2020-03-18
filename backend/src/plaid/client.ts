import * as plaid from 'plaid';

export const plaidClient = new plaid.Client(
    process.env.PLAID_CLIENT_ID as string,
    process.env.PLAID_SECRET as string,
    process.env.PLAID_PUBLIC_KEY as string,
    plaid.environments['development'],
    {
      version: '2018-05-22'
    }
);
