const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const protocol = 'mongodb';
const hostName = 'mongo';
const port = 27017;
const dbName = 'budget';
const url = `${protocol}://${hostName}:${port}/${dbName}`; //'mongodb://mongo:27017/budget';

const connectionRetryDelay = 1000;

var db = mongoose.connection;

db.once('open', function() {
  console.log("Connected successfully to mongodb server");
});

db.on('error', function() {
  console.log('Mongodb server not ready. Retrying...');
  setTimeout(() => connectToDbWithRetry(), connectionRetryDelay);
});

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

function connectToDbWithRetry() {
  console.log('Attempting to connect to mongodb');
  mongoose.connect(url);
}

module.exports = {
  initDb: connectToDbWithRetry
};
