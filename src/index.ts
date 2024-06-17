import readline from 'readline';

import Dictionary from './dictionary';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dictionary = new Dictionary();

const handleCommand = (userInput: string) => {
  const [command, key, ...values] = userInput.split(' ').filter(Boolean);
  const commandFn = dictionary.commands[command.toUpperCase()];

  if (commandFn) {
    const member = values.join(' ');
    try {
      const result = commandFn(key, member);

      if (result !== undefined) {
        if(result.charAt(0) !== '1' && result.charAt(0) !== '(') {
          console.log(`) ${result}`);
        } else {
          console.log(result);
        };
      };
    } catch (error) {
      console.error(error);
    };
  } else {
    console.error('Unknown command');
  };

  rl.question('> ', handleCommand);
};

rl.question("Type a command to get started.\nYou can use the 'Help' command to see a list of commands available\n>", handleCommand);