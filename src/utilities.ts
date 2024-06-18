import * as c from './constants';
import Logger from './logger';
import StylizedLogger from './stylizedLogger';

export const getLogger = () => {
  if (process.env.EXPERIMENTAL_LOGGING === 'true') {
    return StylizedLogger;
  }
  return Logger;
};

export const getMessages = () => {
  if (process.env.EXPERIMENTAL_LOGGING === 'true') {
    return {
      prompt: c.styledPrompt,
      initQuestion: c.styledInitQuestion,
    };
  }
  return { prompt: c.standardPrompt, initQuestion: c.standardInitQuestion };
};

export const arrayToFormattedString = (values: string[]) => {
  if (values.length === 0) {
    return '(empty set)';
  }

  const numberedArray = values.map(
    (value: string, index: number) => `${index + 1}) ${value}`,
  );

  return numberedArray.join('\n');
};
