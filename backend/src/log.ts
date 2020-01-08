export function debug(section, logText, exception = undefined) {
  log('DEBUG', section, logText, exception);
}

export function error(section, logText, exception = undefined) {
  log('ERROR', section, logText, exception);
}

function log(level, section, logText, exception = undefined) {
  console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
  if (exception) console.log(exception);
}
