# Tests

## Unit Tests
Unit tests are denoted with the extension `.unit.spec.js`. They can be run with `npm test`

## Integration Tests
Integration tests are run against a real database. They are denoted with the extension `.integration.spec.js`. They can be run by uncommenting the relevant lines in docker-compose.yml and then running `npm start`.

TODO:
  - write readme file
  - install on my server
  - add existing transactions to server
    - consider automated way to download them?
    - perhaps download the JSON directly from google scripts?
    - perhaps download them all from plaid directly?
    - make sure they match plaid id
