jest.mock('fs');
const mockWriteFile = jest.fn(() => Promise.resolve());

jest.mock('util', () => ({
  promisify: () => mockWriteFile,
}));

const onPreBuild = require('./index').onPreBuild;

describe('onPreBuild', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    mockWriteFile.mockReset();
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe('with context prefix ENV overrides', () => {
    it('writes an env file with updated values', async () => {
      process.env.DATABASE_URL = 'https://dev.com';
      process.env.STAGING_DATABASE_URL = 'https://stage.com';
      process.env.CONTEXT = 'staging';
      await onPreBuild({ inputs: { mode: 'prefix' } });

      expect(mockWriteFile).toHaveBeenCalledWith('.env', 'DATABASE_URL=https://stage.com\n');
    });
  });

  describe('with suffix context prefix ENV overrides', () => {
    it('writes an env file with updated values', async () => {
      process.env.DATABASE_URL = 'https://dev.com';
      process.env.DATABASE_URL_STAGING = 'https://stage.com';
      process.env.CONTEXT = 'staging';
      await onPreBuild({ inputs: { mode: 'suffix' } });

      expect(mockWriteFile).toHaveBeenCalledWith('.env', 'DATABASE_URL=https://stage.com\n');
    });
  });

  describe('with branch ENV overrides', () => {
    it('writes an env file with updated values', async () => {
      process.env.DATABASE_URL = 'https://dev.com';
      process.env.HELLO_DATABASE_URL = 'https://stage.com';
      process.env.BRANCH = 'hello';
      await onPreBuild({ inputs: { mode: 'prefix' } });

      expect(mockWriteFile).toHaveBeenCalledWith('.env', 'DATABASE_URL=https://stage.com\n');
    });
  });

  describe('with suffix branch ENV overrides', () => {
    it('writes an env file with updated values', async () => {
      process.env.DATABASE_URL = 'https://dev.com';
      process.env.DATABASE_URL_HELLO = 'https://stage.com';
      process.env.BRANCH = 'hello';
      await onPreBuild({ inputs: { mode: 'suffix' } });

      expect(mockWriteFile).toHaveBeenCalledWith('.env', 'DATABASE_URL=https://stage.com\n');
    });
  });

  describe('without ENV overrides', () => {
    it('writes an env file with updated values', async () => {
      process.env.DATABASE_URL = 'https://dev.com';
      process.env.BRANCH = 'hello';
      await onPreBuild({ inputs: { mode: 'prefix' } });

      expect(mockWriteFile).not.toHaveBeenCalled();
    });
  });
});
