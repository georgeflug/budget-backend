const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const morgan = require('morgan');
import {debug} from '../log';

const compression = require('compression');

const port = 3000;
const serverOptions = {
  key: fs.readFileSync("./certs/budget-backend-private.key"),
  passphrase: process.env.BUDGET_CERT_PASSWORD,
  cert: fs.readFileSync("./certs/budget-backend-public.crt")
};

export function initExpress() {
  app.use(express.json());
  app.use(morgan(':date[iso] ACCESS ":method :url HTTP/:http-version" Remote:":remote-addr - :remote-user" Response: ":status - :response-time ms" Referrer:":referrer" User-agent:":user-agent"'));
  app.use(compression());

  require('./status').init(app);
  app.use(require('./auth'));
  app.use(require('./feature-idea/feature-idea-controller').router);
  app.use(require('./transactions').router);
  app.use(require('./scrape-mfa').router);
  app.use(require('./plaid').router);
  app.use(require('./refresh').router);
  app.use(require('./balance/balance-controller').router);
  app.use(require('../check-accounts-controller').router);
  app.use(require('./raw-plaid').router);

  https.createServer(serverOptions, app).listen(port);

  debug('Startup', `Listening on localhost:${port}`);
}
