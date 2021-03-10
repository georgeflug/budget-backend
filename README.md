# Budget Backend

This app is the backend for a custom budget application.

## Getting Started

```
npm install
npm start
```

## Tests

### Unit Tests
Unit tests are denoted with the extension `.unit.spec.js`. They can be run with `npm test`

### Integration Tests
Integration tests are run against a real database. They are denoted with the extension `.integration.spec.js`. They can be run by uncommenting the relevant lines in docker-compose.yml and then running `npm start`.

TODO:
  - install on my server
  - add existing transactions to server
    - download all plaid transactions since august (temporary script)
    - manually add plaid ids to google sheets
    - update google sheets to return plaid id in the json
    - add endpoint to new backend app to accept google sheets json
    - endpoint will download all plaid transactions after accepting google sheets json to fulfill all metadata

Migration Plan:
  - update the app to accept the new backend
  - install the backend on the server
  - transfer existing transactions
  - install the new app on phones
  - transfer any remaining transactions
  - deprecate/disable the old google sheets

How to run backend on the server:
  - Clone the repo
  - Set up all the environment variables defined in the docker.compose.yml file.
  - Open port: sudo ufw allow 3000
  - Start docker: sudo service docker start
  - Start the service: npm run serverRestart

## Plaid Link

### New Linked Account
Plaid Link has the following workflow to set up a new account:
1. Backend makes request to /link-token which creates a temporary token.
2. Send temporary token to UI. UI opens Plaid Link client, which walks user through 
   connecting an account. This creates a public token.
3. Send public token to backend. Backend exchanges public token with Plaid for access 
   token and item ID.

### Existing Linked Account
Plaid Link has the following workflow to update the credentials of an existing account:
1. A request to PLAID fails with the error, ITEM_LOGIN_REQUIRED, indicating the account
   needs to be updated.
2. Backend makes request to /link/token/create, passing in the existing access token. 
   This creates a temporary token.
3. Send the temporary token to the UI. The UI opens the Plaid Link client in update 
   mode, which walks the user through reconnecting the account.
4. No further exchanges are needed. The existing access token will work again.

In Sandbox mode, you can force an item to need an update by calling /sandbox/item/reset_login.
