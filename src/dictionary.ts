import fs from 'fs';
import readline from 'readline';

import {getLogger} from './utilities';

const Logger = getLogger();

class Dictionary {
  private data: Map<string, string[]>;
  private name: string
  public commands: { [key: string]: Function };

  constructor(name: string) {
    this.name = name;
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
      EXIT: this.exit,
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

  add(key: string, member: string) {
    const values = this.data.get(key) || [];

    if (!key || !member) {
      throw 'ADD requires a key and a member';
    } else if (values.includes(member)) {
      throw 'member already exists for the key';
    } else {
      values.push(member);

      this.data.set(key, values);

      return 'Added';
    }
  }

  remove(key: string, member: string) {
    const members = this.data.get(key);

    if (!key || !member) {
      throw 'REMOVE requires a key and a member';
    } else if (!members) {
      throw 'key does not exist';
    } else if (!members.includes(member)) {
      throw 'member does not exist on key';
    } else if (members.length === 1) {
      this.data.delete(key);

      return 'Removed';
    } else {
      const memberIndex = members.indexOf(member);
      members.splice(memberIndex, 1);

      this.data.set(key, members);

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

  memberExists(key: string, member: string) {
    if (!key || !member) {
      throw `MEMBEREXISTS requires a key and a member`;
    } else {
      const members = this.data.get(key) || [];

      return members.includes(member);
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
    const items: string[] = [];

    for (const [key, value] of this.data.entries()) {
      for (const member of value) {
        items.push(`${key}: ${member}`);
      }
    }

    return items;
  }

  help() {
    return Object.keys(this.commands).join(' ');
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
      const importData: { [key: string]: string[] } = JSON.parse(fileContents);

      for (const key in importData) {
        this.data.set(key, importData[key]);
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

  export(filePath?: string) {
    const exportString = filePath
      ? `${filePath}${this.name}.json`
      : `${this.name}.json`;

    if (this.data.size === 0) {
      throw 'there is nothing to export';
    }

    const fileData = JSON.stringify(Object.fromEntries(this.data), null, 2);

    try {
      fs.writeFileSync(exportString, fileData);

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
