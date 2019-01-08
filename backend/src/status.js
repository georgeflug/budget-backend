function init(app) {
  app.get('/', function (req, res) {
    res.send('Hello World')
  })
  
  app.get('/status', function (req, res) {
    res.send('{"status":"OK"}')
  });  
}

module.exports = {
  init: init
};
