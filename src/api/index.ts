import {debug, error} from "../log";
import * as http from "http";

const express = require('express');
require('express-async-errors');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const compression = require('compression');

const port = 3000;
// const https = require('https');
// const fs = require('fs');
// const serverOptions = {
//   key: fs.readFileSync("./certs/budget-backend-private.key"),
//   passphrase: config.budgetCertPassword,
//   cert: fs.readFileSync("./certs/budget-backend-public.crt")
// };

export function initExpress() {
  app.use(express.json());
  app.use(morgan(':date[iso] ACCESS ":method :url HTTP/:http-version" Remote:":remote-addr - :remote-user" Response: ":status - :response-time ms" Referrer:":referrer" User-agent:":user-agent"'));
  app.use(compression());
  app.use(cors());
  app.use(express.static('../../budget-web/build'));

  require('./status').init(app);
  // app.use(require('./auth'));
  app.use(require('../feature-idea/feature-idea-controller').router);
  app.use(require('../transaction/transaction-controller').router);
  app.use(require('./refresh').router);
  app.use(require('../balance/balance-controller').router);
  app.use(require('./check-account-connectivity/check-accounts-controller').router);
  app.use(require('../raw-plaid/raw-plaid-controller').router);
  app.use(require('./push-notifications/push-notification-controller').router);
  app.use(function (err: Error, req, res, _next) {
    error('GLOBAL ERROR', 'Uncaught Exception', err);
    res.status(500).send({
      message: err.message || err
    })
  });

  // https.createServer(serverOptions, app).listen(port);
  http.createServer(app).listen(port);

  debug('Startup', `Listening on localhost:${port}`);
}
