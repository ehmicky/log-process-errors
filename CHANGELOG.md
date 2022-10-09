# 10.1.1

## Internal

- Add more tests

# 10.1.0

## Features

- Improve error detection using
  [`is-error-instance`](https://github.com/ehmicky/is-error-instance)

# 10.0.0

## Package size

The npm package size has been reduced by 98%, from 4500kB to 87kB.

## Custom logic

The `log` option was renamed to [`onError`](README.md#onerror). Its arguments
are `(originalError, event)` instead of `(error, level, originalError)`.

The process error `event` is now passed as a second argument instead of being
set as `error.name`. Its case is not capitalized anymore, to match the event
name in Node.js.

Before:

```js
logProcessErrors({
  log(error) {
    if (error.name === 'UncaughtException') {
      console.error(error)
    }
  },
})
```

After:

```js
logProcessErrors({
  onError(error, event) {
    if (event === 'uncaughtException') {
      console.error(error)
    }
  },
})
```

## Pretty-printing

Errors are not pretty-printed anymore. As a consequence, the `colors` option was
removed too. The [`onError` option](README.md#onerror) can be used instead to
customize how the errors are printed.

## Filtering

The `levels` option was removed. The [`onError` option](README.md#onerror) can
be used for filtering.

Before:

```js
logProcessErrors({
  levels: {
    warning: 'silent',
  },
})
```

After:

```js
logProcessErrors({
  onError(error, event) {
    if (event !== 'warning') {
      console.error(error)
    }
  },
})
```

## Testing option

The `testing` option was removed. The [`onError` option](README.md#onerror) can
be used instead.

Before:

```js
logProcessErrors({ testing: 'ava' })
```

After:

```js
logProcessErrors({
  // Throw the `error` to make the unit test fail while letting other tests run
  onError(error) {
    throw error
  },
})
```

## Process exit

The `exitOn` option was changed from an array of strings to a simpler boolean.
It was also renamed [`exit`](README.md#exit).

The exit is still graceful, i.e. it waits for ongoing tasks to complete, up to 3
seconds. However, if there are none, the process now exits immediately.

Before:

```js
logProcessErrors({ exitOn: [] })
```

After:

```js
logProcessErrors({ exit: false })
```

## Compatibility with other libraries

If other libraries (such as
[Winston](https://github.com/winstonjs/winston/#to-exit-or-not-to-exit),
[Bugsnag](https://docs.bugsnag.com/platforms/javascript/#reporting-unhandled-errors),
etc.) are also listening for process events, they might also try to exit the
process. This created conflicts with this library. This has been fixed by making
the [`exit` option](README.md#exit) default to `false` when process events
listeners already exist.

## Bug fixes

- Fix support for `--unhandled-rejections=strict`
- Do not crash when `error.stack` is `undefined` or `null`
- Support cross-realm errors

## TypeScript

TypeScript types have been simplified.

## Internal

Added 100% test coverage.

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
