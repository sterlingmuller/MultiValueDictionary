import readline from 'readline';

import Dictionary from './dictionary';
import { handleCommand, getMessages } from './utilities';

const indexMessages = getMessages();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: indexMessages.prompt,
});

const dictionary = new Dictionary();
const inputHandler = (userInput: string) => {
  handleCommand(dictionary, userInput, rl);
};

rl.on('line', inputHandler);

rl.question(indexMessages.question, inputHandler);
