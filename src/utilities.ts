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
      createDictionary: c.styledCreateDictionary,
      useDictionary: c.styledUseDictionary,
    };
  }
  return {
    prompt: c.standardPrompt,
    createDictionary: c.standardCreateDictionary,
    useDictionary: c.standardUseDictionary,
  };
};

export const arrayToFormattedString = (members: string[]) => {
  if (members.length === 0) {
    return '(empty set)';
  }

  const formattedMembers = members.map(
    (member: string, index: number) => `${index + 1}) ${member}`,
  );

  return formattedMembers.join('\n');
};
