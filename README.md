[![downloads](https://img.shields.io/npm/dt/on-process-error.svg?logo=npm)](https://www.npmjs.com/package/on-process-error) [![last commit](https://img.shields.io/github/last-commit/autoserver-org/on-process-error.svg?logo=github)](https://github.com/autoserver-org/on-process-error/graphs/contributors) [![license](https://img.shields.io/github/license/autoserver-org/on-process-error.svg?logo=github)](https://www.apache.org/licenses/LICENSE-2.0) [![npm](https://img.shields.io/npm/v/on-process-error.svg?logo=npm)](https://www.npmjs.com/package/on-process-error) [![node](https://img.shields.io/node/v/on-process-error.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-green.svg?logo=eslint)](https://github.com/autoserver-org/eslint-config-standard-prettier-fp)

Add an event listener to handle any process errors:

- [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception): an exception was thrown and not caught
- [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection): a promise was rejected and not handled
- [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled): a promise was rejected and handled too late
- [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves): a promise was resolved/rejected twice
- [`warning`](https://nodejs.org/api/process.html#process_event_warning): a warning was produced using [`process.emitWarning()`](https://nodejs.org/api/process.html#process_process_emitwarning_warning_options)

# Usage

<!-- eslint-disable no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict -->

```js
const onProcessError = require('on-process-error')

const undoSetup = onProcessError.setup()
```

When any process errors occur, it will be logged using `console.error()`:

- the message will include detailed information about the error
- for `warning`, `console.warn()` will be used instead.
- for `uncaughtException`, [`process.exit(1)` will be called after
  `console.error()`](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).

You can undo everything by firing the function returned by
`onProcessError.setup()` (called `undoSetup` in the example above).

# Custom handling

You can override the default behavior by passing a custom function instead.

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict -->

```js
const onProcessError = require('on-process-error')

const undoSetup = onProcessError.setup(
  ({ eventName, promiseState, promiseValue, error, message }) => {},
)
```

The function's argument is an object with the following properties:

- `eventName` `{string}`: can be `uncaughtException`, `unhandledRejection`,
  `rejectionHandled`, `multipleResolves` or `warning`
- `promiseState` `{string}`: whether promise was `resolved` or `rejected`.
  For `unhandledRejection`, `rejectionHandled` and `multipleResolves`.
- `promiseValue` `{any}`: value resolved/rejected by the promise.
  For `unhandledRejection`, `rejectionHandled` and `multipleResolves`.
- `error` `{error}`:
  - can be:
    - thrown by `uncaughtException`
    - emitted by `warning`. [`error.name`, `error.code` and `error.detail`](https://nodejs.org/api/process.html#process_event_warning)
      might be defined.
    - rejected by `unhandledRejection`, `rejectionHandled` or
      `multipleResolves`'s promise (if the promise was rejected).
  - if the error is not an `Error` instance (e.g. if it is a string), it will
    be normalized to one using `new Error()`.
- `message` `{string}`: detailed message summing up all of the above.
