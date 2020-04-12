/**
 * Overrides an ENV var with a value if it exists
 * @param {*} key the key to overwrite if found
 * @param {*} contextOrBranch the value to check
 * @param {*} mode the mode to use (prefix or suffix)
 */
function setEnvWithValue(key, contextOrBranch, mode) {
  let foundOne = false;

  if (mode === "prefix") {
    const prefixedEnvVar = `${contextOrBranch}_${key}`;

    if (process.env[prefixedEnvVar]) {
      foundOne = true;
      console.log(`Setting ${prefixedEnvVar} to ${key}.`);
      process.env[key] = process.env[prefixedEnvVar];
    }
  } else {
    const suffixedEnvVar = `${key}_${contextOrBranch}`;

    if (process.env[suffixedEnvVar]) {
      foundOne = true;
      console.log(`Setting ${suffixedEnvVar} to ${key}.`);
      process.env[key] = process.env[suffixedEnvVar];
    }
  }

  return foundOne;
}

module.exports = {
  onPreBuild: ({ inputs }) => {
    const context = `${process.env.CONTEXT}`.toUpperCase().replace(/-/g, "_");
    const branch = `${process.env.BRANCH}`.toUpperCase().replace(/-/g, "_");
    const replaced = [];

    Object.keys(process.env).forEach((key) => {
      const foundContext = setEnvWithValue(key, context, inputs.mode);
      const foundBranch = setEnvWithValue(key, branch, inputs.mode);

      if (foundContext || foundBranch) replaced.push(key);
    });

    if (replaced.length) {
      console.log(`Replaced ${replaced.length} ENVs`);
    } else {
      console.log(`Nothing found... keeping default ENVs`);
    }
  },
};
