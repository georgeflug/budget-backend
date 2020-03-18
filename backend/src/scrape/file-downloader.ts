const fs = require('fs');
const fsp = require('fs').promises;

const homedir = require('os').homedir();
const downloadsFolder = homedir + '/Downloads/';

function downloadFileByTriggering(triggerAction) {
  return new Promise((resolve, reject) => {
    watchForFileAndDownloadIt(resolve, reject);
    triggerAction();
  });
}

function watchForFileAndDownloadIt(resolve, reject) {
  const watcher = fs.watch(downloadsFolder, (eventType, fileName) => {
    if (!isTemporaryChromeFile(fileName)) {
      watcher.close();
      setTimeout(() => {
        downloadFile(fileName)
            .then(file => resolve(file))
            .catch(e => reject(e));
      }, 1000);
    }
  });

}

function isTemporaryChromeFile(fileName) {
  return fileName.includes('.chromium') || fileName.includes('.crdownload');
}

async function downloadFile(fileName) {
  const path = downloadsFolder + '/' + fileName;
  const rawFile = await fsp.readFile(path, 'utf8');
  await fsp.unlink(path);
  return rawFile.toString('utf8');
}

module.exports = {
  downloadFileByTriggering: downloadFileByTriggering
};
