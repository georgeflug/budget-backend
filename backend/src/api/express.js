var express = require('express')
var app = express()

const port = 3000;

function initExpress() {
  app.use(express.json());
  require('./status').init(app);
  app.use(require('./feature-idea'));
  app.use(require('./transactions'));
  app.listen(port);
  console.log(`Listening on localhost:${port}`);  
}

module.exports = {
  initExpress: initExpress,
};