var express = require('express')

var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/status', function (req, res) {
  res.send('{"status":"OK"}')
});

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://mongo:27017';

// Database Name
const dbName = 'budget';

// Use connect method to connect to the server
connectToDbWithRetry(function(err, client) {
  console.log("Connected successfully to mongodb server");

  const db = client.db(dbName);

  app.get('/read', function (req, res) {
    const collection = db.collection('documents');
    collection.find().toArray(function(err, docs) {
      res.send(docs);
    });
  });

  app.get('/write', function (req, res) {
    const collection = db.collection('documents');
    collection.insertMany([{a : 1}], function(err, result) {
      res.send(result);
    });
  });

  app.listen(3000)
  console.log('Listening on localhost:3000');
});

function connectToDbWithRetry(cb) {
  console.log('Attempting to connect to mongodb');
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Mongodb server not ready. Retrying...');
      setTimeout(() => connectToDbRaw(cb), 1000);  
    } else {
      cb(null, client);
    }
  });
}
