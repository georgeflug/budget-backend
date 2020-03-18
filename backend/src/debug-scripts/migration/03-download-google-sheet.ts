const url = 'https://script.google.com/macros/s/AKfycbzJXrwFepauVmiodXfe81zETyqgAMcwdjR8fRjJ1NvrcpAgPPg/exec';
const method = 'getTransactions';


import * as fs from 'fs';

const request = require('request');

request(`${url}?route=${method}`, {json: true}, (err, res, body) => {
  if (err) {
    return console.log(err);
  }
  fs.writeFileSync('google-sheets.json', JSON.stringify(body, null, 2));
  // console.log(body.url);
  // console.log(body.explanation);
});
