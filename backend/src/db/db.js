const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const protocol = 'mongodb';
const hostName = 'mongo';
const port = 27017;
const dbName = 'budget';
const url = `${protocol}://${hostName}:${port}/${dbName}`; //'mongodb://mongo:27017/budget';
const log = require('../log');

const connectionRetryDelay = 1000;
let isConnected = false;
let promiseRes = () => { };

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.once('open', function () {
  log.debug('DB', 'Connected successfully to mongodb server');
  isConnected = true;
  promiseRes();
});

db.on('error', function () {
  log.debug('DB', 'Mongodb server not ready. Retrying...');
  setTimeout(() => mongoose.connect(url), connectionRetryDelay);
});

function connectToDbWithRetry() {
  if (isConnected) return Promise.resolve();

  log.debug('DB', 'Attempting to connect to mongodb');

  return new Promise((res, rej) => {
    promiseRes = res;
    mongoose.connect(url);
  });
}

module.exports = {
  initDb: connectToDbWithRetry
};
