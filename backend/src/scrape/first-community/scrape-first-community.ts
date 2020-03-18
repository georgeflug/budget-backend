const puppeteer = require('puppeteer');
import * as process from 'process';

var ofx = require('ofx');
const fileDownloader = require('../file-downloader');
const ofxParser = require('../ofx-parser');
const mfaCodes = require('../mfa-codes');
const sleep = require('../sleep');

async function downloadTransactions() {
  log("Initiating Scrape");

  log("Starting the browser");
  let browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  log("Browser started successfully");

  log("Opening a new tab");
  let page = await browser.newPage();

  log("Navigating to first community");
  await page.goto('https://www.firstcommunity.com/home.html');

  log("Login: Entering username");
  await page.type('#username', process.env.BUDGET_FCCU_USERNAME);
  log("Login: Entering password");
  await page.type('#password', process.env.BUDGET_FCCU_PASSWORD);
  log("Login: Clicking login button");
  await page.click('#oblSubmit');

  log("Waiting for logged in site to load");
  await page.waitForNavigation({waitUntil: 'networkidle2'});

  log("Waiting 10 seconds for animations to finish");
  await sleep(10000);

  try {
    log("MFA: Checking if multi-factor authentication was triggered");
    await page.waitForSelector('.mfa-destination-button-container .btn', {timeout: 5000});

    log("MFA: Multi-factor authentication was triggered. Clicking the SMS button");
    await page.click('.mfa-destination-button-container .btn');

    log('MFA: Waiting for MFA Code');
    const mfaCode = await mfaCodes.getFccuToken();
    log('MFA: Got MFA Code: ' + mfaCode);

    try {
      log('MFA: Checking for code input field');
      await page.waitForSelector('#mfaCodeInputField', {timeout: 1000});
      log('MFA: Found the code input field');
    } catch (e) {
      log('MFA: Failed to find the code input field. Maybe we took too long. Restarting from the beginning');
      await browser.close();
      return await downloadTransactions();
    }

    log('MFA: Typing in the code');
    await page.type('#mfaCodeInputField', mfaCode);

    log('MFA: Clicking the submit button for the code');
    await page.click('.mfa-button-container .btn');
  } catch (e) {
    if (e.constructor.name !== "TimeoutError") {
      log(`Failure: ${e}`);
      throw e;
    } else {
      log("MFA: Multi-factor authentication was not triggered. Moving on.");
    }
  }

  // temporary: try loggin in again
  log('Closing the browser');
  await browser.close();

  log("Starting the browser");
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  log("Browser started successfully");

  log("Opening a new tab");
  page = await browser.newPage();

  log("Navigating to first community");
  await page.goto('https://www.firstcommunity.com/home.html');

  log("Login: Entering username");
  await page.type('#username', process.env.BUDGET_FCCU_USERNAME);
  log("Login: Entering password");
  await page.type('#password', process.env.BUDGET_FCCU_PASSWORD);
  log("Login: Clicking login button");
  await page.click('#oblSubmit');

  log("Waiting for logged in site to load");
  await page.waitForNavigation({waitUntil: 'networkidle2'});

  log("Waiting 10 seconds for animations to finish");
  await sleep(10000);

  try {
    log("MFA: Checking if multi-factor authentication was triggered");
    await page.waitForSelector('.mfa-destination-button-container .btn', {timeout: 5000});

    log("MFA: Multi-factor authentication was triggered. Clicking the SMS button");
  } catch (e) {
    if (e.constructor.name !== "TimeoutError") {
      log(`Failure: ${e}`);
      throw e;
    } else {
      log("MFA: Multi-factor authentication was not triggered. Moving on.");
    }
  }

  log('Closing the browser');
  await browser.close();

  return;


  log('Checking: Clicking on "First Rate Checking 78"');
  await page.click('#accountNameahToNBD3Ka1HhzcKQIikKJ-8FbPGCs1aa6D4Pc33AqQ');

  log('Checking: Waiting for the checking account page to load');
  await page.waitForNavigation({waitUntil: 'networkidle2'});

  log('Checking: Clicking on the Export button');
  await page.click('#_15uqqS2z-k0c038a03baNN');

  log('Checking: Selecting the OFX option');
  await page.click('#ExportOFXLabelContainer');

  log('Checking: Clicking the final Export button and downloading the file');
  const theFile = await fileDownloader.downloadFileByTriggering(() => page.click('#exportFile'));
  log('Checking: File download successful');

  log('Closing the browser');
  await browser.close();

  const transactions = ofxParser.parseToJson(theFile);
  console.dir(transactions);

  // await page.waitForNavigation();

  // var downloadUrl = 'https://card.discover.com/cardmembersvcs/ofxdl/ofxWebDownload?stmtKey=CTD&startDate=20190130&endDate=20190130&fileType=QFX&bid=9625&fileName=Discover-RecentActivity-20190130.qbo';
  // var downloadedThing = await download(page, downloadUrl);

  // const transactions = parseOfx(downloadedThing);
  // console.dir(transactions);
}

function log(msg) {
  console.log(`${new Date()}: Scrape First Community: ${msg}`);
}

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

function parseOfx(rawOfxData) {
  var ofxData = ofx.parse(rawOfxData);
  var transactions = ofxData.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.BANKTRANLIST.STMTTRN;
  return transactions.map((t) => {
    return {
      datePosted: t.DTPOSTED,
      transactionType: t.TRNTYPE,
      amount: t.TRNAMT,
      fitId: t.FITID,
      name: t.NAME
    };
  });
}

downloadTransactions();
