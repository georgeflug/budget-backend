const express = require('express')
const app = express()
const fs = require('fs');
const https = require('https');

const port = 3000;
const serverOptions = {
  key: fs.readFileSync("./certs/budget-backend-private.key"),
  passphrase: process.env.BUDGET_CERT_PASSWORD,
  cert: fs.readFileSync("./certs/budget-backend-public.crt")
};

function initExpress() {
  app.use(express.json());
  require('./status').init(app);
  app.use(require('./auth'));
  app.use(require('./feature-idea'));
  app.use(require('./transactions'));
  app.use(require('./scrape-mfa'));
  app.use(require('../plaid/rest'));

  https.createServer(serverOptions, app).listen(port);

  console.log(`Listening on localhost:${port}`);
}

module.exports = {
  initExpress: initExpress,
};
