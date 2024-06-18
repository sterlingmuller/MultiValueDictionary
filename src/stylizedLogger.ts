import * as c from './constants';
import { arrayToFormattedString } from './utilities';

class StylizedLogger {
  response(result: string | string[] | boolean) {
    if (Array.isArray(result)) {
      console.log(c.RESPONSE_COLOR, arrayToFormattedString(result));
    } else {
      console.log(c.RESPONSE_COLOR, result);
    }
  }
  error(message: string, optionalParam?: string) {
    if (optionalParam) {
      console.error(c.red, `${message}:`, c.yellow, optionalParam, c.reset);
    } else {
      console.error(c.red, message, c.reset);
    }
  }
}

export default StylizedLogger;
