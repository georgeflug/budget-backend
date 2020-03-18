const puppeteer = require('puppeteer');
const request = require('request-promise');
const fileDownloader = require('./file-downloader');

const homedir = require('os').homedir();
const downloadsFolder = homedir + '/Downloads/';

async function testADownload() {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://sample-videos.com/download-sample-text-file.php');

  const theFile = await fileDownloader.downloadFileByTriggering(() => page.click('.download_text'));

  console.log(theFile);

  await browser.close();
}

testADownload();
