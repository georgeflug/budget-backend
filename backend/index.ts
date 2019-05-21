require('./src/db/db').initDb();
require('./src/api/index').initExpress();
require('./src/plaid/schedule').startScheduler();
