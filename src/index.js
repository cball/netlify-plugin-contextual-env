const { exec } = require("child_process");
const fs = require("fs");

/**
 * Overrides an ENV var with a value if it exists
 * @param {*} key the key to overwrite if found
 * @param {*} contextOrBranch the value to check
 * @param {*} mode the mode to use (prefix or suffix)
 */
function setEnvWithValue(key, contextOrBranch, mode) {
  let foundOne = false;
  let found;

  if (mode === "prefix") {
    const prefixedEnvVar = `${contextOrBranch}_${key}`;

    if (process.env[prefixedEnvVar]) {
      console.log(`Setting ${key} to the value from ${prefixedEnvVar}.`);
      process.env[key] = process.env[prefixedEnvVar];
      found = `${key}=${process.env[prefixedEnvVar]}`;
    }
  } else {
    const suffixedEnvVar = `${key}_${contextOrBranch}`;

    if (process.env[suffixedEnvVar]) {
      console.log(`Setting ${key} to the value from ${suffixedEnvVar}.`);
      process.env[key] = process.env[suffixedEnvVar];
      found = `${key}=${process.env[suffixedEnvVar]}`;
    }
  }

  return found;
}

module.exports = {
  onPreBuild: ({ inputs }) => {
    const context = `${process.env.CONTEXT}`.toUpperCase().replace(/-/g, "_");
    const branch = `${process.env.BRANCH}`.toUpperCase().replace(/-/g, "_");
    const replaced = [];

    Object.keys(process.env).forEach((key) => {
      const foundContext = setEnvWithValue(key, context, inputs.mode);
      const foundBranch = setEnvWithValue(key, branch, inputs.mode);

      if (foundContext) replaced.push(foundContext);
      if (foundBranch) replaced.push(foundBranch);
    });

    if (replaced.length) {
      // Write an env file so we can source it during build
      const file = fs.createWriteStream(".env");
      replaced.forEach(function (v) {
        file.write(`${v}\n`);
      });
      file.end();

      console.log(`Replaced ${replaced.length} ENVs and wrote .env file`);
    } else {
      console.log(`Nothing found... keeping default ENVs`);
    }
  },
};
