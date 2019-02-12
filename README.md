[![downloads](https://img.shields.io/npm/dt/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![last commit](https://img.shields.io/github/last-commit/ehmicky/log-process-errors.svg?logo=github&logoColor=white)](https://github.com/ehmicky/log-process-errors/graphs/contributors) [![license](https://img.shields.io/badge/license-Apache%202.0-4cc61e.svg?logo=github&logoColor=white)](https://www.apache.org/licenses/LICENSE-2.0) [![Coverage Status](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=test%20coverage&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors) [![travis](https://img.shields.io/travis/ehmicky/log-process-errors/master.svg?logo=travis)](https://travis-ci.org/ehmicky/log-process-errors/builds) [![npm](https://img.shields.io/npm/v/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-4cc61e.svg?logo=eslint&logoColor=white)](https://github.com/ehmicky/eslint-config-standard-prettier-fp) [![Gitter](https://img.shields.io/gitter/room/ehmicky/log-process-errors.svg?logo=gitter)](https://gitter.im/ehmicky/log-process-errors)

Node.js emits errors on
[`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`warning`](https://nodejs.org/api/process.html#process_event_warning) and
mishandled promises
([`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves)).
Unfortunately by default those errors:

- do not print stack traces nor promise values for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning),
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  and
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).
- are inconvenient to [log to an external service](#custom-logging).
- are [printed repeatedly](#duplicate-events) when the same error occurs
  several times (except for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning)).
- are not human-friendly.

`log-process-errors` fixes those issues:

![Screenshot](docs/screenshot.png)

# Installation

```bash
$ npm install -D log-process-errors
```

`log-process-errors` modifies logging globally. It should not be installed as
a production dependency inside libraries since users might not expect this side effect. Also this might lead to conflicts between libraries.

# Usage (simple)

```bash
$ node -r log-process-errors/register ...
```

# Usage (custom)

```js
const logProcessErrors = require('log-process-errors')

logProcessErrors(options)
```

`logProcessErrors()` should be called as early as possible in the code.

`options` is an optional object with the following properties:

- [`log` `{function}`](#custom-logging)
- [`level` `{function}`](#log-level)
- [`message` `{function}`](#log-message)
- [`colors` `{boolean}`](#log-message)
- [`exitOn` `{string[]}`](#process-exit)

# Duplicate events

Duplicate events are only logged once.

# Process exit

The `exitOn` option specifies which event should trigger `process.exit(1)`:

- the default value is `['uncaughtException']`. This is the default
  behavior of Node.js. It's also recommended by the
  [official documentation](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).
- we recommend using `['uncaughtException', 'unhandledRejection']`
  instead since this will be the [future default behavior of Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections).
- to prevent any `process.exit(1)`, use `[]`

`process.exit(1)` will only be fired after successfully logging the event.

# Custom logging

By default events will be logged to the console (e.g. `console.error()`).

This behavior can be overridden with the `log` option. For example to log events
with [Winston](https://github.com/winstonjs/winston) instead:

```js
logProcessErrors({
  log(message, level, info) {
    winstonLogger[level](message)
  },
})
```

The function's arguments are:

- `message` `{string}`: nice and detailed description of the event. Can be
  customized with the [`message` option](#log-message).
- `level` `{string}`: log level. Can be customized with the
  [`level` option](#log-level).
- `info` `{object}`: [event information](#event-info).

If logging is asynchronous, the function should return a promise (or use
`async`/`await`). This is not necessary if logging is using streams (like
[Winston](https://github.com/winstonjs/winston)).

# Log level

By default the log level will be `warn` for `warning` events and `error` for
the other events.

This can be overridden by using the `level` option. It should either:

- `undefined` to use the default value.
- a string among `error`, `warn`, `info`, `debug` or `silent`.
- a function using [`info` as argument](#event-information) and returning one of
  the above.

```js
logProcessErrors({
  level({ eventName }) {
    return eventName === 'uncaughtException' ? 'error' : 'silent'
  },
})
```

# Log message

A nice-looking and descriptive log message is generated by default.

The message will be colorized unless the option `colors` is set to `false`.

The message generation can be overridden by using the `message` option. It
should be a function using [`info` as argument](#event-information) and
returning a string.

# Event information

The options `log`, `level` and `message` all receive as argument an `info`
object with information about the event. It has the following properties:

- `eventName` `{string}`: can be `uncaughtException`, `unhandledRejection`,
  `rejectionHandled`, `multipleResolves` or `warning`.
- `error` `{any}`:
  - either the value thrown by `uncaughtException`.
  - or the error emitted by `warning`.
  - it is usually an `Error` instance but could technically be anything.
- `promiseState` `{string}`: whether the promise was `resolved` or
  `rejected`.
- `promiseValue` `{any}`: value resolved/rejected by the promise.
- `secondPromiseState`, `secondPromiseValue`: like `promiseState` and
  `promiseValue` but for the second time the promise was resolved/rejected.

Whether the properties above are defined or not depends on the event name:

- `eventName`: always present.
- `error`: only on `uncaughtException` and `warning`.
- `promiseState`, `promiseValue`: only on `unhandledRejection`,
  `rejectionHandled` and `multipleResolves`.
- `secondPromiseState`, `secondPromiseValue`: only on `multipleResolves`.

The following properties are also defined with the `message` option:

- `level` `{string}`
- `colors` `{object}`: [Chalk instance](https://github.com/chalk/chalk#api)
  to colorize strings (disabled if the option `colors` is `false`).

# Stop logging

Logging can be stopped by firing the function returned by `logProcessErrors()`

```js
const logProcessErrors = require('log-process-errors')

const stopLogging = logProcessErrors(options)

stopLogging()
```
