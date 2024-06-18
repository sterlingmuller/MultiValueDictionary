import readline from 'readline';

import Dictionary from './dictionary';
import { getLogger, getMessages } from './utilities';

const Logger = getLogger();
const indexMessages = getMessages();
const dictionary = new Dictionary();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: indexMessages.prompt
});

export const handleCommand = (
  userInput: string,
) => {
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
    } catch (error: any) {
      Logger.error(error);
    }
  } else {
    Logger.error('Unknown command');
  }

rl.prompt();
};

rl.on('line', handleCommand)

rl.question(indexMessages.initQuestion, handleCommand);
