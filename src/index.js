const fs = require('fs');
const util = require('util');
const pWriteFile = util.promisify(fs.writeFile);

/**
 * Overrides an ENV var with a value if it exists
 * @param {*} key the key to overwrite if found
 * @param {*} contextOrBranch the value to check
 * @param {*} mode the mode to use (prefix or suffix)
 */
function setEnvWithValue(key, contextOrBranch, mode) {
  const envVar = mode === 'prefix' ? `${contextOrBranch}_${key}` : `${key}_${contextOrBranch}`;

  if (!process.env[envVar]) {
    return;
  }

  console.log(`Exporting ${key}=${process.env[envVar]}.`);

  // Renable this once setting process.env is supported in Netlify builds
  // See: https://github.com/netlify/build/issues/1129
  // process.env[key] = process.env[envVar];
  return `${key}=${process.env[envVar]}\n`;
}

module.exports = {
  onPreBuild: async ({ inputs }) => {
    const context = `${process.env.CONTEXT}`.toUpperCase().replace(/-/g, '_');
    const branch = `${process.env.BRANCH}`.toUpperCase().replace(/-/g, '_');

    const envOverrides = Object.keys(process.env).map((key) => [
      setEnvWithValue(key, context, inputs.mode),
      setEnvWithValue(key, branch, inputs.mode),
    ]);

    const replaced = [].concat(...envOverrides).filter(Boolean);

    if (replaced.length) {
      // Write an env file so we can source it during build
      await pWriteFile('.env', replaced.join(''));

      console.log(`Replaced ${replaced.length} ENVs and wrote .env file`);
    } else {
      console.log(`Nothing found... keeping default ENVs`);
    }
  },
};
