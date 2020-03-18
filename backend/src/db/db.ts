// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

const protocol = 'mongodb';
let hostName = 'mongo';
const port = 27017;
const dbName = 'budget';
import {debug} from '../log';

const connectionRetryDelay = 1000;
let isConnected = false;
let promiseRes = () => {
};

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.once('open', function () {
  debug('DB', 'Connected successfully to mongodb server');
  isConnected = true;
  promiseRes();
});

db.on('error', function () {
  debug('DB', 'Mongodb server not ready. Retrying...');
  setTimeout(() => mongoose.connect(getUrl()), connectionRetryDelay);
});

export function connectToDbWithRetry(optionalHostName) {
  if (isConnected) {
    return Promise.resolve();
  }
  hostName = optionalHostName || hostName;

  debug('DB', 'Attempting to connect to mongodb');

  return new Promise((res) => {
    promiseRes = res;
    mongoose.connect(getUrl());
  });
}

function getUrl() {
  return `${protocol}://${hostName}:${port}/${dbName}`; //'mongodb://mongo:27017/budget';
}
