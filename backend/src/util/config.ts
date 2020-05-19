export const config = {
  plaidClientId: process.env.PLAID_CLIENT_ID as string,
  plaidSecret: process.env.PLAID_SECRET as string,
  plaidPublicKey: process.env.PLAID_PUBLIC_KEY as string,
  plaidEnv: process.env.PLAID_ENV as string || 'development',

  discoverAccessKey: process.env.DISCOVER_ACCESS_KEY as string,
  fccuAccessKey: process.env.FCCU_ACCESS_KEY as string,

  secretUsername: process.env.SECRET_USERNAME as string,
  secretPassword: process.env.SECRET_PASSWORD as string,
  budgetCertPassword: process.env.BUDGET_CERT_PASSWORD as string,
};
