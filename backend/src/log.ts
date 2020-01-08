// temporary code to have typescript recognize this file as a module
export {};

function createLogger(level) {
  return function (section, logText, exception = undefined) {
    console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
    if (exception) console.log(exception);
  }
}

export const debug = createLogger('DEBUG');
export const error = createLogger('ERROR');
