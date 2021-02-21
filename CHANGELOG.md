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
