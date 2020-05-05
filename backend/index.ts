require('./src/db/mongo').connectToDbWithRetry();
require('./src/api/index').initExpress();
require('./src/plaid/schedule').startScheduler();
