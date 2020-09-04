export function init(app) {
  app.get('/status', function (req, res) {
    res.send('{"status":"OK"}')
  });
}
