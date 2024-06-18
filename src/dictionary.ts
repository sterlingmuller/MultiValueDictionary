import fs from 'fs';
import readline from 'readline';

import {getLogger} from './utilities';

const Logger = getLogger();

class Dictionary {
  private data: Map<string, string[]>;
  public commands: { [key: string]: Function };

  constructor() {
    this.data = new Map<string, string[]>();
    this.commands = {
      KEYS: this.keys.bind(this),
      MEMBERS: this.members.bind(this),
      ADD: this.add.bind(this),
      REMOVE: this.remove.bind(this),
      REMOVEALL: this.removeAll.bind(this),
      CLEAR: this.clear.bind(this),
      KEYEXISTS: this.keyExists.bind(this),
      MEMBEREXISTS: this.memberExists.bind(this),
      ALLMEMBERS: this.allMembers.bind(this),
      ITEMS: this.items.bind(this),
      HELP: this.help.bind(this),
      IMPORT: this.import.bind(this),
      EXPORT: this.export.bind(this),
      EXIT: this.exit.bind(this),
    };
  }

  keys() {
    return [...this.data.keys()];
  }

  members(key: string) {
    if (!key) {
      throw 'MEMBERS requires a key';
    }

    const membersArr = this.data.get(key);
    if (!membersArr) {
      throw 'key does not exist';
    }

    return membersArr;
  }

  add(key: string, value: string) {
    const values = this.data.get(key) || [];

    if (!key || !value) {
      throw 'ADD requires a key and a value';
    } else if (values.includes(value)) {
      throw 'member already exists for the key';
    } else {
      values.push(value);

      this.data.set(key, values);

      return 'Added';
    }
  }

  remove(key: string, value: string) {
    const membersArr = this.data.get(key);

    if (!key || !value) {
      throw 'REMOVE requires a key and a value';
    } else if (!membersArr) {
      throw 'key does not exist';
    } else if (!membersArr.includes(value)) {
      throw 'member does not exist on key';
    } else if (membersArr.length === 1) {
      this.data.delete(key);

      return 'Removed';
    } else {
      const valueIndex = membersArr.indexOf(value);
      membersArr.splice(valueIndex, 1);

      this.data.set(key, membersArr);

      return 'Removed';
    }
  }

  removeAll(key: string) {
    if (!key) {
      throw 'REMOVEALL requires a key';
    } else if (!this.data.get(key)) {
      throw 'key does not exist';
    } else {
      this.data.delete(key);

      return 'Removed';
    }
  }

  clear() {
    this.data.clear();

    return 'Cleared';
  }

  keyExists(key: string) {
    if (!key) {
      throw 'KEYEXISTS requires a key';
    } else {
      return this.data.has(key);
    }
  }

  memberExists(key: string, value: string) {
    if (!key || !value) {
      throw `MEMBEREXISTS requires a key and a value`;
    } else {
      const members = this.data.get(key) || [];

      return members.includes(value);
    }
  }

  allMembers() {
    const allMembers: string[] = [];

    for (const values of this.data.values()) {
      allMembers.push(...values);
    }

    return allMembers;
  }

  items() {
    const itemsArray: string[] = [];

    for (const [key, values] of this.data.entries()) {
      for (const value of values) {
        itemsArray.push(`${key}: ${value}`);
      }
    }

    return itemsArray;
  }

  help() {
    const commandsArr = Object.keys(this.commands);
    const commandsStr = commandsArr.join(' ');

    return commandsStr;
  }

  import(filePath: string) {
    if (!filePath) {
      throw 'IMPORT requires a file path';
    }
    if (!filePath.endsWith('.json')) {
      throw 'only JSON files are supported';
    }
    try {
      const fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
      const data: { [key: string]: string[] } = JSON.parse(fileContents);

      for (const key in data) {
        this.data.set(key, data[key]);
      }

      return 'Dictionary imported!';
    } catch (error: any) {
      if (error.name === 'SyntaxError') {
        Logger.error('invalid JSON syntax', error.message);
        return;
      }
      if (error.code === 'ENOENT') {
        throw 'file not found';
      }
      Logger.error('import failed', error.message);
      return;
    }
  }

  export(filePath: string) {
    if (!filePath) {
      throw 'EXPORT requires a file path';
    }
    if (!filePath.endsWith('.json')) {
      throw "invalid file path. The file must have a '.json' extension";
    }
    if (this.data.size === 0) {
      throw 'there is nothing to export';
    }

    const fileData = JSON.stringify(Object.fromEntries(this.data), null, 2);

    try {
      fs.writeFileSync(filePath, fileData);

      return 'Dictionary exported!';
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw `directory not found`;
      } else {
        Logger.error('export failed', error.message);
        return;
      }
    }
  }

  exit(rlInterface: readline.Interface) {
    Logger.response('Goodbye!');
    rlInterface.close();
  }
}

export default Dictionary;
