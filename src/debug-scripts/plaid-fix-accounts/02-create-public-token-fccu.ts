import * as plaid from 'plaid'

const client = new plaid.Client(
  process.env.PLAID_CLIENT_ID as string,
  process.env.PLAID_SECRET as string,
  process.env.PLAID_PUBLIC_KEY as string,
  plaid.environments['development'],
  {
    version: '2018-05-22',
  },
)

// Create a public_token for use with Plaid Link's update mode
client.createPublicToken(process.env.FCCU_ACCESS_KEY as string, (err, result) => {
  // Handle err
  // Use the generated public_token to initialize Plaid Link
  // in update mode for a user's Item so that they can provide
  // updated credentials or MFA information
  console.log(result)
})
