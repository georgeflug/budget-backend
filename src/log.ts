export function debug(section, logText, exception = undefined) {
  log('DEBUG', section, logText, exception);
}

export function error(section, logText, exception: (Error | string | undefined) = undefined) {
  log('ERROR', section, logText, exception);
}

function log(level, section, logText, exception: (Error | string | undefined) = undefined) {
  console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
  if (exception) {
    console.log(indent((exception as Error).stack || exception.toString()));
  }
}

function indent(text: string): string {
  const indentation = ' '.repeat(4);
  return indentation + text.replace(/\n/g, '\n' + indentation);
}
