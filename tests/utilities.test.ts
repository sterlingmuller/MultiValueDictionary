import {
  arrayToFormattedString,
  getLogger,
  getMessages,
} from '../src/utilities';
import Logger from '../src/logger';
import StylizedLogger from '../src/stylizedLogger';
import { styledPrompt, standardPrompt } from '../src/constants';

jest.mock('../src/logger', () => {
  return {} as Logger;
});
jest.mock('../src/stylizedLogger', () => {
  return {} as StylizedLogger;
});

jest.mock('../src/constants', () => ({
  styledPrompt: 'mock styled prompt',
  standardPrompt: 'mock standard prompt',
}));

describe('getLogger', () => {
  afterEach(() => {
    delete process.env.EXPERIMENTAL_LOGGING;
  });

  describe("when the EXPERIMENTAL_LOGGING environmental variable is set to 'true'", () => {
    it('returns the StylizedLogger', () => {
      process.env.EXPERIMENTAL_LOGGING = 'true';
      const logger = getLogger();
      expect(logger).toBe(StylizedLogger);
    });
  });

  it('returns the standard logger', () => {
    process.env.EXPERIMENTAL_LOGGING = 'false';
    const logger = getLogger();
    expect(logger).toBe(Logger);
  });
});

describe('getMessages', () => {
  afterEach(() => {
    delete process.env.EXPERIMENTAL_LOGGING;
  });

  describe("when the EXPERIMENTAL_LOGGING environmental variable is set to 'true'", () => {
    it('returns an object with the styled messages', () => {
      process.env.EXPERIMENTAL_LOGGING = 'true';
      const messages = getMessages();

      expect(messages).toEqual(
        expect.objectContaining({ prompt: styledPrompt }),
      );
    });
  });

  it('returns an object with the standard messages', () => {
    const messages = getMessages();

    expect(messages).toEqual(
      expect.objectContaining({ prompt: standardPrompt }),
    );
  });
});

describe('arrayToFormattedString', () => {
  describe('when the length of the members array is 0', () => {
    it("returns '(empty set)'", () => {
      const result = arrayToFormattedString([]);

      expect(result).toEqual('(empty set)');
    });
  });
  it('returns the formatted array', () => {
    const testArray = ['test1', 'test2'];
    const result = arrayToFormattedString(testArray);

    expect(result).toEqual('1) test1\n2) test2');
  });
});
