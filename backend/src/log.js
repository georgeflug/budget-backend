
function createLogger(level) {
  return function (section, logText) {
    console.log(`${new Date()} ${level} ${section}: ${logText}`);
  }
}

module.exports = {
  debug: createLogger('DEBUG'),
  error: createLogger('ERROR')
}
