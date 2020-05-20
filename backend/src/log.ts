export function debug(section, logText, exception = undefined) {
  log('DEBUG', section, logText, exception);
}

export function error(section, logText, exception: (Error | undefined) = undefined) {
  log('ERROR', section, logText, exception);
}

function log(level, section, logText, exception: (Error | undefined) = undefined) {
  console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
  if (exception && exception.stack) console.log(indent(exception.stack));
}

function indent(text: string): string {
  const indentation = ' '.repeat(4);
  return indentation + text.replace(/\n/g, '\n' + indentation);
}
