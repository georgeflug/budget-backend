var express = require('express')
var app = express()
var getDb = require('./db').getDb;

const port = 3000;

function initExpress() {
  require('./status').init(app);

  app.get('/read', function (req, res) {
    const collection = getDb().collection('documents');
    collection.find().toArray(function(err, docs) {
      res.send(docs);
    });
  });
  
  app.get('/write', function (req, res) {
    const collection = getDb().collection('documents');
    collection.insertMany([{a : 1}], function(err, result) {
      res.send(result);
    });
  });
  
  app.listen(port);
  console.log(`Listening on localhost:${port}`);  
}

module.exports = {
  initExpress: initExpress,
};
