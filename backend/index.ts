require('./src/db/db').connectToDbWithRetry();
require('./src/api/index').initExpress();
require('./src/plaid/schedule').startScheduler();
