import { arrayToFormattedString } from './utilities';

class Logger {
  response(result: string | string[] | boolean) {
    if (Array.isArray(result)) {
      console.log(arrayToFormattedString(result));
    } else {
      console.log(`) ${result}`);
    }
  }
  error(message: string, optionalParam?: string) {
    if (optionalParam) {
      console.error(`ERROR, ${message}: ${optionalParam}`);
    } else {
      console.error(`ERROR, ${message}`);
    }
  }
}

export default Logger;
