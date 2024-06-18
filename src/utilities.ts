import { ReadLine } from 'readline';
import Dictionary from './dictionary';
import * as c from './constants';
import createLogger from './loggerFactory';

export const handleCommand = async (
  dictionary: Dictionary,
  userInput: string,
  rl: ReadLine,
) => {
  const Logger = createLogger();
  const [command, key, ...values] = userInput.split(' ').filter(Boolean);
  const formattedCommand = command.toUpperCase();

  if (formattedCommand === 'EXIT') {
    dictionary.exit(rl);
    return;
  }

  const commandFn = dictionary.commands[formattedCommand];

  if (commandFn) {
    const member = values.join(' ');
    try {
      const result = commandFn(key, member);

      if (result !== undefined) {
        Logger.response(result);
      }
    } catch (error) {
      Logger.error(error);
    }
  } else {
    Logger.error('Unknown command');
  }

  rl.prompt();
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

export const getMessages = () => {
  if (process.env.EXPERIMENTAL_LOGGING === 'true') {
    return {
      prompt: c.styledPrompt,
      question: c.styledQuestion,
    };
  }
  return { prompt: c.standardPrompt, question: c.standardQuestion };
};
