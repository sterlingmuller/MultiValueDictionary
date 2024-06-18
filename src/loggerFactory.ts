import Logger from './logger';
import StylizedLogger from './stylizedLogger';

const createLogger = () => {
  if (process.env.EXPERIMENTAL_LOGGING === 'true') {
    return new StylizedLogger();
  }
  return new Logger();
};

export default createLogger;
