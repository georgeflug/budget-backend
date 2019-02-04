const puppeteer = require('puppeteer');
const process = require('process');
var ofx = require('ofx');
const ofxParser = require('../ofx-parser');

async function downloadTransactions() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.discover.com/');
  await page.click('.log-in-link');
  await page.click('.log-in-button');

  await page.waitForSelector('.user-id-input');
  await page.type('.user-id-input', process.env.BUDGET_DISCOVER_USERNAME);
  await page.type('.password-input', process.env.BUDGET_DISCOVER_PASSWORD);
  await page.click('.log-in-button');

  await page.waitForNavigation();
  await page.waitForNavigation();

  var downloadUrl = 'https://card.discover.com/cardmembersvcs/ofxdl/ofxWebDownload?stmtKey=CTD&startDate=20190130&endDate=20190130&fileType=QFX&bid=9625&fileName=Discover-RecentActivity-20190130.qbo';
  var downloadedThing = await download(page, downloadUrl);
  await browser.close();

  const transactions = ofxParser.parseToJson(downloadedThing);
  console.dir(transactions);
};

function download(page, url) {
  return page.evaluate((urlForPuppeteer) => {
    return fetch(urlForPuppeteer, {
        method: 'GET',
        credentials: 'include'
    }).then(r => {
      return r.text();
    });
  }, url);
}

downloadTransactions();
