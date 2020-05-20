WIP: I am converting Transactions to use Json Db.
Todo: Move TransactionSaver metrics to own method somehow.

# Budget Backend

This app is the backend for the Budget Android application.

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

