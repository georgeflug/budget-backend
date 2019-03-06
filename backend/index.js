require('./src/db/db').initDb();
require('./src/api/express').initExpress();
require('./src/plaid/schedule').startScheduler();
