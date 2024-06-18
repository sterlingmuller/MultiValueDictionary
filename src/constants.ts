export const cyan = `\x1b[36m`;
export const red = `\x1b[31m`;

export const green = `\x1b[32m`;
export const yellow = `\x1b[33m`;
export const reset = '\x1b[0m';

export const RESPONSE_COLOR = `${cyan}%s${reset}`;
export const ERROR_COLOR = `${red}%s${reset}`;

export const styledPrompt = `${green}>${reset} `;
export const styledQuestion = `${green}Type a command to get started\nTip: You can use the 'Help' command to see a list of commands available\n>${reset} `;

export const standardPrompt = '> ';
export const standardQuestion =
  "Type a command to get started\nTip: You can use the 'Help' command to see a list of commands available\n> ";
