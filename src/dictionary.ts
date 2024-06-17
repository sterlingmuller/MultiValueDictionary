class Dictionary {
  private data: Map<string, string[]>;
  public commands: { [key: string]: Function };
  private arrayToNumberedString(array: string[]) {
    const numberedArray = array.map(
      (value: string, index: number) => `${index + 1}) ${value}`,
    );

    return numberedArray.join('\n');
  }

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
      HELP: this.help.bind(this)
    };
  }

  keys() {
    const keysArr = [...this.data.keys()];

    if (keysArr.length === 0) {
      return '(empty set)';
    }

    const keysString = this.arrayToNumberedString(keysArr);

    return keysString;
  }

  members(key: string) {
    if (!key) {
      throw 'MEMBERS requires a key';
    }

    const membersArr = this.data.get(key);
    if (!membersArr) {
      throw 'Key does not exist';
    } else {
      const membersStr = this.arrayToNumberedString(membersArr);

      return membersStr;
    }
  }

  add(key: string, value: string) {
    const values = this.data.get(key) || [];

    if (!key || !value) {
      throw 'ADD requires a key and a value';
    } else if (values.includes(value)) {
      throw 'Member already exists for the key';
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
      throw 'Key does not exist';
    } else if (!membersArr.includes(value)) {
      throw 'Member does not exist on key';
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
      throw 'Key does not exist';
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
      const hasKey = this.data.has(key);

      return hasKey;
    }
  }

  memberExists(key: string, value: string) {
    if (!key || !value) {
      throw `MEMBEREXISTS requires a key and a value`;
    } else {
      const members = this.data.get(key) || [];

      const hasMember = members.includes(value);

      return hasMember;
    }
  }

  allMembers() {
    const allMembers: string[] = [];

    for (const values of this.data.values()) {
      allMembers.push(...values);
    }

    if (allMembers.length === 0) {
      return '(empty set)';
    }

    const allMembersStr = this.arrayToNumberedString(allMembers);

    return allMembersStr;
  }

  items() {
    const itemsArray: string[] = [];

    for (const [key, values] of this.data.entries()) {
      for (const value of values) {
        itemsArray.push(`${key}: ${value}`);
      }
    }

    if (itemsArray.length === 0) {
      return '(empty set)';
    }

    const itemsString = this.arrayToNumberedString(itemsArray);

    return itemsString;
  }

  help() {
    const commandsArr = Object.keys(this.commands);
    const commandsStr = commandsArr.join(' ');

    return commandsStr;
  }
}

export default Dictionary;
