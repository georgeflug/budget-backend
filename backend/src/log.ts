// temporary code to have typescript recognize this file as a module
export {};

function log(level, section, logText, exception = undefined) {
  console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
  if (exception) console.log(exception);
}

export function debug(section, logText, exception = undefined) {
  log('DEBUG', section, logText, exception);
}

export function error(section, logText, exception = undefined) {
  log('ERROR', section, logText, exception);
}
