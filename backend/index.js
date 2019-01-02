var express = require('express')

var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/status', function (req, res) {
  res.send('{"status":"OK"}')
});

app.listen(3000)
console.log('Listening on localhost:3000');
