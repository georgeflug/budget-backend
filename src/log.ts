export function debug(section: string, logText: string, exception = undefined): void {
  log('DEBUG', section, logText, exception);
}

export function error(section: string, logText: string, exception: (Error | string | undefined) = undefined): void {
  log('ERROR', section, logText, exception);
}

function log(level: string, section: string, logText: string, exception: (Error | string | undefined) = undefined): void {
  console.log(`${new Date().toISOString()} ${level} ${section}: ${logText}`);
  if (exception) {
    console.log(indent((exception as Error).stack || exception.toString()));
  }
}

function indent(text: string): string {
  const indentation = ' '.repeat(4);
  return indentation + text.replace(/\n/g, '\n' + indentation);
}
