[![downloads](https://img.shields.io/npm/dt/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![last commit](https://img.shields.io/github/last-commit/autoserver-org/log-process-errors.svg?logo=github)](https://github.com/autoserver-org/log-process-errors/graphs/contributors) [![license](https://img.shields.io/github/license/autoserver-org/log-process-errors.svg?logo=github)](https://www.apache.org/licenses/LICENSE-2.0) [![npm](https://img.shields.io/npm/v/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-green.svg?logo=eslint)](https://github.com/autoserver-org/eslint-config-standard-prettier-fp)

Log all process errors on the console (or using your own logger):

- [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception): an exception was thrown and not caught
- [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection): a promise was rejected and not handled
- [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled): a promise was rejected and handled too late
- [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves): a promise was resolved/rejected multiple times
- [`warning`](https://nodejs.org/api/process.html#process_event_warning): a warning was produced using [`process.emitWarning()`](https://nodejs.org/api/process.html#process_process_emitwarning_warning_options)

The message will include nice and detailed information about the error.

![Screenshot](docs/screenshot.png)

# Usage

<!-- eslint-disable no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict -->

```js
const logProcessErrors = require('log-process-errors')

logProcessErrors()
```

# Custom logging

By default errors will be logged to the console using `console.error()`
(or `console.warn()` for `warning`).

You can use the `handle` option to override this default behavior. For example
to log errors with [Winston](https://github.com/winstonjs/winston) instead of
the console:

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
logProcessErrors({
  handle(message, level) {
    winstonLogger[level](message)
  },
})
```

The function's arguments are:

- `message` `{string}`: nice and detailed description of the error
- `level` `{string}`: logging level
- `info` `{object}`: information about the error, with the following properties:
  - `eventName` `{string}`: can be `uncaughtException`, `unhandledRejection`,
    `rejectionHandled`, `multipleResolves` or `warning`
  - `error` `{any}` is either:
    - value thrown by `uncaughtException`. Usually an `Error` instance, but not
      always.
    - `Error` instance emitted by `warning`.
      [`error.name`, `error.code` and `error.detail`](https://nodejs.org/api/process.html#process_event_warning)
      might be defined.
  - `promiseState` `{string}`: whether promise was `resolved` or `rejected`.
    For `unhandledRejection`, `rejectionHandled` and `multipleResolves`.
  - `promiseValue` `{any}`: value resolved/rejected by the promise.
    For `unhandledRejection`, `rejectionHandled` and `multipleResolves`.

# Exiting on uncaught exceptions

By default, `uncaughtException` will fire `process.exit(1)`. This is the recommended behavior according to the
[Node.js documentation](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).

You can disable this by setting the `exitOnExceptions` option to `false`:

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
logProcessErrors({ exitOnExceptions: false })
```

# Remove logging

You can undo everything by firing the function returned by
`logProcessErrors()`

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
const removeLogging = logProcessErrors()
removeLogging()
```
