const MongoClient = require('mongodb').MongoClient;

const protocol = 'mongodb';
const hostName = 'mongo';
const port = 27017;
const url = `${protocol}://${hostName}:${port}`; //'mongodb://mongo:27017';

const connectionRetryDelay = 1000;

// Database Name
const dbName = 'budget';
let db = null;

function initDb() {
  // Use connect method to connect to the server
  connectToDbWithRetry(function(err, client) {
    console.log("Connected successfully to mongodb server");

    db = client.db(dbName);
  });
}

function connectToDbWithRetry(cb) {
  console.log('Attempting to connect to mongodb');
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Mongodb server not ready. Retrying...');
      setTimeout(() => connectToDbRaw(cb), connectionRetryDelay);
    } else {
      cb(null, client);
    }
  });
}

function getDb() {
  if (db) return db;
  throw('Db not initialized');
}

module.exports = {
  initDb: initDb,
  getDb: getDb,
};
