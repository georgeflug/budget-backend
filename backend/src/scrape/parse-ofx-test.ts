const  ofx = require('ofx');
const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.log('Usage: node src/scrape/parse-ofx.js {ofx-filename}');
  process.exit(1);
}

fs.readFile(file, 'utf8', function(err, ofxData) {
  if (err) throw err;

  const data = ofx.parse(ofxData);
  console.log(JSON.stringify(data, null, 2));
});
