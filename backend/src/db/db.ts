// temporary code to have typescript recognize this file as a module
export { };

const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const protocol = 'mongodb';
let hostName = 'mongo';
const port = 27017;
const dbName = 'budget';
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
  setTimeout(() => mongoose.connect(getUrl()), connectionRetryDelay);
});

function connectToDbWithRetry(optionalHostName) {
  if (isConnected) return Promise.resolve();
  hostName = optionalHostName || hostName;

  log.debug('DB', 'Attempting to connect to mongodb');

  return new Promise((res, rej) => {
    promiseRes = res;
    mongoose.connect(getUrl());
  });
}

function getUrl() {
  return `${protocol}://${hostName}:${port}/${dbName}`; //'mongodb://mongo:27017/budget';
}

module.exports = {
  initDb: connectToDbWithRetry
};
