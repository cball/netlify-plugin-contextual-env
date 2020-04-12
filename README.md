# netlify-plugin-env

This plugin swaps out ENV vars on Netlify at build time. Here's how it works.

Say you have an ENV in your API code called `DATABASE_URL`. If you use this plugin, you'll be able to override that value based on a Context or Branch name.

For example:

- A `staging` branch, could automatically set `DATABASE_URL` to the value of `STAGING_DATABASE_URL` if it exists.
- A `production` context could automatically set `DATABASE_URL` to the value of `PRODUCTION_DATABASE_URL` if it exists.

This allows you to have per-environment or per-context environment variables, without exposing those variables in your `netlify.toml` config.

# Usage

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
