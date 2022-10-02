# 10.0.0

## Breaking changes

- Replace the `exitOn` option by the simpler
  [`keep` boolean option](README.md#keep)
- Remove the following options: `testing`, `colors`, `levels`. Please use the
  [`log` option](README.md#log) instead.
- The [`log` option's](README.md#log) arguments are now: `(error, reason)`
  instead of `(error, level, originalError)`
- The `error` passed to the [`log` option](README.md#log) is now the original
  process error. Its `name` is left unchanged.
- Errors are not pretty-printed anymore
- TypeScript types have been simplified

## Features

- Reduce npm package size

## Bug fixes

- On uncaught exceptions, do not hold the process for 3 seconds unless there are
  still some ongoing tasks
- Support cross-realm errors
- Do not crash when `error.stack` is `undefined` or `null`
- Fix support for `--unhandled-rejections=strict`

# 9.4.0

## Features

- Reduce npm package size

# 9.3.0

## Documentation

- Document related projects, including
  [`modern-errors`](https://github.com/ehmicky/modern-errors)

# 9.2.0

## Features

- Reduce npm package size

# 9.1.0

## Features

- Add TypeScript types

# 9.0.0

## Breaking changes

- Minimal supported Node.js version is now `14.18.0`

# 8.0.0

## Breaking changes

- `multipleResolves` has been
  [deprecated by Node.js](https://github.com/nodejs/node/pull/41872). Therefore,
  support for it has been removed.
  - If your code uses the `level` or `exitOn` option with a `multipleResolves`
    parameter, you should remove it.
  - Otherwise, this release is not a breaking change for you.

# 7.0.1

## Bug fixes

- Fix `main` field in `package.json`

# 7.0.0

## Breaking changes

- The `log-process-errors/build/register` export has been removed. Please
  [import `log-process-errors` directly](README.md#usage) instead.
- The [`testing` option value](docs/API.md#testing) `node-tap` has been renamed
  to `node_tap`
- Minimal supported Node.js version is now `12.20.0`
- This package is now an ES module. It can only be loaded with an `import` or
  `import()` statement, not `require()`. See
  [this post for more information](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

## Features

- Improve colors detection

# 6.3.0

## Features

- Improve colors on Windows terminal

# 6.2.0

## Features

- The [`exitOn()` option](docs/API.md#exiton) now defaults to
  `['uncaughtException', 'unhandledRejection']` on Node `>= 15.0.0`. Its default
  value is still `['uncaughtException']` on Node `< 15.0.0`. This is to mimic
  Node.js default behavior:
  [since Node `15.0.0`](https://github.com/nodejs/node/pull/33021), processes
  exit on unhandled promises.

# 6.1.1

## Bug fixes

- Fix handling uncaught exceptions or warnings that are not `Error` instances
  (#32)

# 6.1.0

## Features

- Pass original error to [`log()` option](docs/API.md#log)

## Bug fixes

- Do not remove error static properties

# 6.0.1

## Dependency

- Remove unused dependency `core-js`

# 6.0.0

## Breaking changes

- Minimal supported Node.js version is now `10.17.0`

# 5.1.2 (backport)

## Dependency

- Remove unused dependency `core-js`

# 5.1.1 (backport)

## Bug fixes

- Fix handling uncaught exceptions or warnings that are not `Error` instances
  (#32)

# 5.1.0 (backport)

## Features

- Pass original error to [`log()` option](docs/API.md#log)

## Bug fixes

- Do not remove error static properties

# 5.0.3

## Bug fixes

- Do not make tests fail on `multipleResolves` events with the `testing` option

# 5.0.2

## Bug fixes

- Do not handle deprecation warnings on unhandled rejection promises anymore
  since this is due to a bug in Node `12.6.0` which has been fixed in `12.7.0`.

# 5.0.1

## Bug fixes

- Do not print deprecation warnings on unhandled rejection promises with Node
  `12.6.0`

## Dependencies

- Upgrade `supports-color`

# 5.0.0

Thanks to @Hongarc and @stevenvachon for their first-time contributions!

## Breaking changes

- Minimum Node.js version is now `8.12.0` (instead of `8.10.0`)

## Documentation

- Improve documentation and examples

## Internal

- Upgrade development dependencies
- Code refactoring
- Improve linting

# 4.1.1

## Dependencies

- Upgrade `figures`
- Upgrade `moize`

## Internal

- Upgrade development dependencies
- Code refactoring

# 4.1.0

## Internal

- Use ES modules

# 4.0.0

## Breaking changes

- Rename `log-process-errors/register` to `log-process-errors/build/register`
