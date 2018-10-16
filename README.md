[![downloads](https://img.shields.io/npm/dt/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![last commit](https://img.shields.io/github/last-commit/autoserver-org/log-process-errors.svg?logo=github)](https://github.com/autoserver-org/log-process-errors/graphs/contributors) [![license](https://img.shields.io/github/license/autoserver-org/log-process-errors.svg?logo=github)](https://www.apache.org/licenses/LICENSE-2.0) [![npm](https://img.shields.io/npm/v/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-green.svg?logo=eslint)](https://github.com/autoserver-org/eslint-config-standard-prettier-fp)

Log any process errors:

- [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception): an exception was thrown and not caught
- [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection): a promise was rejected and not handled
- [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled): a promise was rejected and handled too late
- [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves): a promise was resolved/rejected twice
- [`warning`](https://nodejs.org/api/process.html#process_event_warning): a warning was produced using [`process.emitWarning()`](https://nodejs.org/api/process.html#process_process_emitwarning_warning_options)

# Usage

<!-- eslint-disable no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict -->

```js
const logProcessErrors = require('log-process-errors')

const undoSetup = lopProcessErrors.setup()
```

When any process errors occur, it will be logged using `console.error()`.
The message will include detailed information about the error.

For `warning`, `console.warn()` will be used instead.

You can undo everything by firing the function returned by
`onProcessError.setup()` (called `undoSetup` in the example above).

# Example output

TO BE DONE

# Custom handling

You can override the default behavior by passing a custom function to the
`handle` option.

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
onProcessError.setup({
  handle({ eventName, promiseState, promiseValue, error, message }) {},
})
```

This can be useful if you want to use your own logger instead of the console.

The function's argument is an object with the following properties:

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
- `message` `{string}`: detailed message summing up all of the above.

# Exiting on uncaught exceptions

By default, `uncaughtException` will fire `process.exit(1)`. This is the recommended behavior according to the
[Node.js documentation](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).

You can disable this by setting the `exitOnExceptions` option to `false`:

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
onProcessError.setup({ exitOnExceptions: false })
```
