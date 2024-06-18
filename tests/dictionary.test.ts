import fs from 'fs';
import { ReadLine } from 'readline';

import Dictionary from '../src/dictionary';
import {getLogger} from '../src/utilities';

jest.mock('../src/utilities', () => ({
  getLogger: jest.fn()
    .mockReturnValue({ response: jest.fn(), error: jest.fn() }),
}));

describe('Dictionary', () => {
  let dictionary: Dictionary;
  beforeEach(() => {
    dictionary = new Dictionary();
  });

  describe('keys', () => {
    describe('when there are no keys in the dictionary', () => {
      it('returns the expected response', () => {
        expect(dictionary.keys()).toEqual([]);
      });
    });
    it('logs the list of keys on the dictionary', () => {
      dictionary.add('floop', 'troop');

      expect(dictionary.keys()).toEqual(['floop']);
    });
  });

  describe('members', () => {
    describe('when no key is provided', () => {
      it('throws the expected error', () => {
        expect(dictionary.members).toThrow('MEMBERS requires a key');
      });
    });
    describe('when the provided key is not stored on the dictionary', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.members('non_existant_key')).toThrow(
          'key does not exist',
        );
      });
    });
    it('returns the formatted list of members on a key', () => {
      dictionary.add('test', 'floop');
      const result = dictionary.members('test');

      expect(result).toEqual(['floop']);
    });
  });

  describe('add', () => {
    describe('when a parameter is missing', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.add('test', undefined as any)).toThrow(
          'ADD requires a key and a member',
        );
      });
    });
    describe('when the member already exists on the key', () => {
      it('throws the expected error', () => {
        dictionary.add('test', 'floop');

        expect(() => dictionary.add('test', 'floop')).toThrow(
          'member already exists for the key',
        );
      });
    });
    it("adds the key-value pair to the dictionary and returns 'Added'", () => {
      const result = dictionary.add('test', 'floop');

      expect(dictionary.members('test')).toEqual(['floop']);
      expect(result).toEqual('Added');
    });
  });

  describe('remove', () => {
    describe('when a parameter is missing', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.remove('test', undefined as any)).toThrow(
          'REMOVE requires a key and a member',
        );
      });
    });
    describe('when the provided key is not stored on the dictionary', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.remove('test', 'one')).toThrow(
          'key does not exist',
        );
      });
    });
    describe('when the provided member is not stored on the key', () => {
      it('throws the expected error', () => {
        dictionary.add('test', 'one');
        expect(() => dictionary.remove('test', 'blargh')).toThrow(
          'member does not exist on key',
        );
      });
    });
    describe('when there is the provided member is the only member stored on the key', () => {
      it("removes the provided member and key then returns 'Removed'", () => {
        dictionary.add('test', 'one');
        const result = dictionary.remove('test', 'one');

        expect(dictionary.keys()).toEqual([]);
        expect(result).toEqual('Removed');
      });
    });
    it("removes the provided member from the key and returns 'Removed'", () => {
      dictionary.add('test', 'one');
      dictionary.add('test', 'two');
      const result = dictionary.remove('test', 'one');

      expect(result).toEqual('Removed');
    });
  });

  describe('removeAll', () => {
    describe('when no key is provided', () => {
      it('throws the expected error', () => {
        expect(dictionary.removeAll).toThrow('REMOVEALL requires a key');
      });
    });
    describe('when the provided key is not stored on the dictionary', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.removeAll('blurgh')).toThrow(
          'key does not exist',
        );
      });
    });
    it("removes the key and associated members from the dictionary and returns 'Removed'", () => {
      dictionary.add('test', 'one');
      dictionary.add('test', 'two');
      const result = dictionary.removeAll('test');

      expect(dictionary.keys()).toEqual([]);
      expect(result).toEqual('Removed');
    });
  });

  describe('clear', () => {
    it("clears the dictionary and returns 'Clear'", () => {
      dictionary.add('test', 'one');
      const result = dictionary.clear();

      expect(dictionary.keys()).toEqual([]);
      expect(result);
    });
  });

  describe('keyExists', () => {
    describe('when no key is provided', () => {
      it('throws the expected error', () => {
        expect(dictionary.keyExists).toThrow('KEYEXISTS requires a key');
      });
    });
    describe('when the provided key exists', () => {
      it("returns 'True'", () => {
        dictionary.add('test', 'one');
        const result = dictionary.keyExists('test');

        expect(result).toEqual(true);
      });
    });
    describe('when the provided key does not exist', () => {
      it("returns 'false'", () => {
        const result = dictionary.keyExists('test');

        expect(result).toEqual(false);
      });
    });
  });

  describe('memberExists', () => {
    describe('when a parameter is missing', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.memberExists('test', undefined as any)).toThrow(
          'MEMBEREXISTS requires a key and a member',
        );
      });
    });
    describe('when the provided member exisits on the key', () => {
      it("returns 'True'", () => {
        dictionary.add('test', 'one');
        const result = dictionary.memberExists('test', 'one');

        expect(result).toEqual(true);
      });
    });
    describe('when the provided member does not exisit on the key', () => {
      it("returns 'false'", () => {
        const result = dictionary.memberExists('test', 'one');

        expect(result).toEqual(false);
      });
    });
  });

  describe('allMembers', () => {
    describe('when there are no members in the dictionary', () => {
      it('returns the expected response', () => {
        const result = dictionary.allMembers();

        expect(result).toEqual([]);
      });
    });
    it('returns the formatted list of all members in the dictionary', () => {
      dictionary.add('test', 'one');
      dictionary.add('test', 'two');
      dictionary.add('floop', 'one');
      const result = dictionary.allMembers();

      expect(result).toEqual(['one', 'two', 'one']);
    });
  });

  describe('items', () => {
    describe('when the dictionary is empty', () => {
      it('returns the expected response', () => {
        const result = dictionary.items();

        expect(result).toEqual([]);
      });
    });
    it('returns the formatted list of all keys and members in the dictionary', () => {
      dictionary.add('test', 'one');
      dictionary.add('test', 'two');
      dictionary.add('floop', 'one');
      const result = dictionary.items();

      expect(result).toEqual(['test: one', 'test: two', 'floop: one']);
    });
  });

  describe('help', () => {
    it('returns the expected list of commands from the dictionary class', () => {
      const result = dictionary.help();

      expect(result).toEqual(
        'KEYS MEMBERS ADD REMOVE REMOVEALL CLEAR KEYEXISTS MEMBEREXISTS ALLMEMBERS ITEMS HELP IMPORT EXPORT EXIT',
      );
    });
  });

  describe('import', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the filePath is not provided', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.import(undefined as any)).toThrow(
          'IMPORT requires a file path',
        );
      });
    });
    describe('when the filePath does not have the JSON extension', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.import('test.doc')).toThrow(
          'only JSON files are supported',
        );
      });
    });
    describe('when the import fails', () => {
      const mockLogger = getLogger();

      describe('when there is a syntax error', () => {
        it('calls Logger.error with the expected message', () => {
          jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('blah');

          const result = dictionary.import('badDictionary.json');

          expect(result).toEqual(undefined);
          expect(mockLogger.error).toHaveBeenCalledWith(
            'invalid JSON syntax',
            expect.any(String),
          );
        });
      });
      describe('when the error code is ENOENT', () => {
        it('calls Logger.error with the expected message', () => {
          const mockError = { code: 'ENOENT' };
          jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            throw mockError;
          });

          expect(() => dictionary.import('does_not_exist.json')).toThrow(
            'file not found',
          );
        });
      });
      it('calls Logger.error with the expected message', () => {
        const mockError = 'oops!';
        jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
          throw new Error(mockError);
        });

        const result = dictionary.import('blurg.json');

        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith(
          'import failed',
          mockError,
        );
      });
    });
    it("imports the provided file and returns 'Dictionary imported!'", () => {
      const mockFileData = JSON.stringify({ test: ['one'] });

      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(mockFileData);
      const result = dictionary.import('goodDictionary.json');

      expect(dictionary.keys()).toEqual(['test']);
      expect(result).toEqual('Dictionary imported!');
    });
  });

  describe('export', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when the filePath is not provided', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.export(undefined as any)).toThrow(
          'EXPORT requires a file path',
        );
      });
    });
    describe('when the filePath does not have the JSON extension', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.export('blarg.doc')).toThrow(
          "invalid file path. The file must have a '.json' extension",
        );
      });
    });
    describe('when the dictionary is empty', () => {
      it('throws the expected error', () => {
        expect(() => dictionary.export('test.json')).toThrow(
          'there is nothing to export',
        );
      });
    });
    describe('when the export fails', () => {
      describe('when the error code is ENOENT', () => {
        it('calls Logger.error with the expected message', () => {
          dictionary.add('test', 'one');
          const mockError = { code: 'ENOENT' };

          jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
            throw mockError;
          });

          expect(() => dictionary.export('../fakeFolder/test.json')).toThrow(
            'directory not found',
          );
        });
      });
      it('calls Logger.error with the expected message', () => {
        dictionary.add('test', 'one');
        const mockError = 'oops!';

        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
          throw new Error(mockError);
        });
        const result = dictionary.export('blurg.json');
        const mockLogger = getLogger();

        expect(result).toEqual(undefined);
        expect(mockLogger.error).toHaveBeenCalledWith(
          'export failed',
          mockError,
        );
      });
    });
    it("exports the provided file and returns 'Dictionary exported!'", () => {
      dictionary.add('test', 'one');

      jest.spyOn(fs, 'writeFileSync').mockReturnValueOnce(undefined);
      const result = dictionary.export('goodDictionary.json');

      expect(result).toEqual('Dictionary exported!');
    });
  });

  describe('exit', () => {
    it('calls Logger.response with the expected message and closes the app', () => {
      const mockLogger = getLogger();
      const mockRLInterface = { close: jest.fn() } as unknown as ReadLine;
      dictionary.exit(mockRLInterface);

      expect(mockLogger.response).toHaveBeenCalledWith('Goodbye!');
      expect(mockRLInterface.close).toHaveBeenCalledTimes(1);
    });
  });
});
