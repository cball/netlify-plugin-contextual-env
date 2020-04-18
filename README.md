# netlify-plugin-contextual-env

This plugin swaps out ENV vars on Netlify at build time. Here's how it works:

Say you have an ENV in your API code called `DATABASE_URL`. If you use this plugin, you'll be able to override that value based on a Context or Branch name.

Right now, this plugin writes a `.env` file in the root of the project with the new values, which most build tooling will pick up on. Unfortunately, we can't set `proces.env` directly until it is [supported by Netlify Build](https://github.com/netlify/build/issues/1129))

For example:

- A `staging` branch, would automatically set `DATABASE_URL` to the value of `STAGING_DATABASE_URL` if it exists.
- A `production` context would automatically set `DATABASE_URL` to the value of `PRODUCTION_DATABASE_URL` if it exists.
- A `deploy-preview` context (used for Pull Requests) would automatically set `DATABASE_URL` to the value of `DEPLOY_PREVIEW_DATABASE_URL` if it exists.

This allows you to have per-environment or per-context environment variables, without exposing those variables in your `netlify.toml` config.

If you'd rather use a suffix rather than the default prefix configuration, pass suffix to the inputs below.

For the examples above, it would use the values `DATABASE_URL_STAGING`, `DATABASE_URL_PRODUCTION`, and `DATABASE_URL_DEPLOY_PREVIEW` respectively.

![image](https://user-images.githubusercontent.com/14339/79061346-6403e100-7c5d-11ea-86ef-34d2857b388b.png)

# Usage

## Add the plugin

Add a `[[plugins]]` entry to your `netlify.toml` file:

```toml
[[plugins]]
package = 'netlify-plugin-env'
  [plugins.inputs]
  mode = 'prefix'
```

| name   | description                                                         | default  |
| ------ | ------------------------------------------------------------------- | -------- |
| `mode` | The way to append the context or branch name (`prefix` or `suffix`) | `prefix` |

## Update your build command

Update your build command to "source" the `.env` file that gets created for you. **Note: your `.env` should always be in `.gitignore`!** This script writes a temporary .env file for you at build time, so updated values can be used during the build process.

You can do this in `netlify.toml`:

```toml
[build]
  command = ". ./.env && yarn build"
```

Or through the Netlify UI if you don't have a `build` section defined in `netlify.toml`:

![image](https://user-images.githubusercontent.com/14339/79069048-45bbd680-7c99-11ea-816b-fec8ee851672.png)
