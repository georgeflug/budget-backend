// temporary code to have typescript recognize this file as a module
export {};

const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
import {debug} from '../log';

const compression = require('compression');
import rawPlaid from './raw-plaid'

const port = 3000;
const serverOptions = {
  key: fs.readFileSync("./certs/budget-backend-private.key"),
  passphrase: process.env.BUDGET_CERT_PASSWORD,
  cert: fs.readFileSync("./certs/budget-backend-public.crt")
};

function initExpress() {
  app.use(express.json());
  app.use(morgan(':date[iso] ACCESS ":method :url HTTP/:http-version" Remote:":remote-addr - :remote-user" Response: ":status - :response-time ms" Referrer:":referrer" User-agent:":user-agent"'));
  app.use(compression());

  require('./status').init(app);
  app.use(require('./auth'));
  app.use(require('./feature-idea'));
  app.use(require('./transactions'));
  app.use(require('./scrape-mfa'));
  app.use(require('./plaid'));
  app.use(require('./refresh'));
  app.use(require('./balances'));
  app.use(require('../check-accounts-controller'));
  app.use(rawPlaid);

  https.createServer(serverOptions, app).listen(port);

  debug('Startup', `Listening on localhost:${port}`);
}

module.exports = {
  initExpress: initExpress,
};
