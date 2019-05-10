// temporary code to have typescript recognize this file as a module
export {};

function createLogger(level) {
  return function (section, logText, exception) {
    console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
    if (exception) console.log(exception);
  }
}

module.exports = {
  debug: createLogger('DEBUG'),
  error: createLogger('ERROR')
}
