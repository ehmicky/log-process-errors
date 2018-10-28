[![downloads](https://img.shields.io/npm/dt/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![last commit](https://img.shields.io/github/last-commit/autoserver-org/log-process-errors.svg?logo=github)](https://github.com/autoserver-org/log-process-errors/graphs/contributors) [![license](https://img.shields.io/github/license/autoserver-org/log-process-errors.svg?logo=github)](https://www.apache.org/licenses/LICENSE-2.0) [![Coverage Status](https://coveralls.io/repos/github/autoserver-org/log-process-errors/badge.svg?branch=master)](https://coveralls.io/github/autoserver-org/log-process-errors?branch=master) [![npm](https://img.shields.io/npm/v/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-green.svg?logo=eslint)](https://github.com/autoserver-org/eslint-config-standard-prettier-fp) [![Gitter](https://img.shields.io/gitter/room/autoserver-org/Lobby.svg)](https://gitter.im/autoserver-org/Lobby)

Log all process errors on the console (or using a custom logger): [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception), [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection), [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled), [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves) and [`warning`](https://nodejs.org/api/process.html#process_event_warning).

![Screenshot](docs/screenshot.png)

While Node.js already prints those errors on the console, `log-process-errors`
provides with the following additional features:

- more detailed messages, including stack traces and promise values for
  `warning`, `rejectionHandled` and `multipleResolves` (which are not printed
  otherwise)
- nicer looking and more descriptive messages
- [log repeated events only once](#duplicate-events)
- [custom logging]($custom-logging)
- [control whether to `process.exit()` or not](#process-exit)

# Usage (preferred)

```bash
$ npm install -D log-process-errors
```

Require this module with the `-r` CLI flag.

```bash
$ node -r log-process-errors ...
```

# Usage (custom)

In order to customize options, `log-process-errors/custom` must be required
like this instead:

```bash
$ npm install log-process-errors
```

<!-- eslint-disable no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
const logProcessErrors = require('log-process-errors/custom')

logProcessErrors(options)
```

`options` is an optional object with the following properties:

- [`log` `{function}`](#custom-logging)
- [`getLevel` `{function}`](#log-level)
- [`getMessage` `{function}`](#log-message)
- [`colors` `{boolean}`](#log-message) (default: `false`)
- [`skipEvent` `{function}`](#skipping-events)
- [`exitOn` `{string[]}`](#process-exit) (default: `['uncaughtException']`)

`logProcessErrors()` should be called as early as possible in the code.

`log-process-errors` modifies logging globally. This is not recommended for
libraries since their users might not expect this side effect. Also this might
lead to conflicts between libraries. Libraries should use the
[`-r log-process-errors` CLI flag](#usage-preferred) instead of
[`require()`](#usage-custom).

# Duplicate events

Duplicate events are only logged once.

It is recommended to use the
[`--no-warnings` CLI flag](https://nodejs.org/api/cli.html#cli_no_warnings) or
the
[`NODE_NO_WARNINGS=1`](https://nodejs.org/api/cli.html#cli_node_no_warnings_1)
environment variable to prevent warnings being logged twice.

# Process exit

The `exitOn` option specifies which event should trigger `process.exit(1)`:

- the default value is `['uncaughtException']`. This is the default
  behavior of Node.js. It's also recommended by the
  [official documentation](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).
- we recommend using `['uncaughtException', 'unhandledRejection']`
  instead since this will be the [future default behavior of Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections)
- to prevent any `process.exit(1)`, use `[]`

`process.exit(1)` will only be fired after successfully logging the event.

# Custom logging

By default events will be logged to the console (e.g. `console.error()`).

This behavior can be overridden with the `log` option. For example to log events
with [Winston](https://github.com/winstonjs/winston) instead:

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
logProcessErrors({
  log(message, level, info) {
    winstonLogger[level](message)
  },
})
```

The function's arguments are:

- `message` `{string}`: nice and detailed description of the event. Can be
  customized with the [`getMessage` option](#log-message).
- `level` `{string}`: log level. Can be customized with the
  [`getLevel` option](#log-level).
- `info` `{object}`: [event information](#event-info)

If logging is asynchronous, the function should return a promise (or use
`async`/`await`). This is not necessary if logging is using streams (like
[Winston](https://github.com/winstonjs/winston)).

# Log level

By default the log level will be `warn` for `warning` events and `error` for
the other events.

This can be overridden by using the `getLevel` option. It should be a function
function using [`info` as argument](#event-info) and returning a string
among `error`, `warn`, `info` or `debug`.

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
logProcessErrors({
  getLevel({ eventName }) {
    return eventName === 'uncaughtException' ? 'error' : 'warn'
  },
})
```

# Log message

A nice-looking and descriptive log message is generated by default.

The message will be colorized unless either:

- the output [does not support colors](https://github.com/chalk/supports-color)
- the option `colors` is set to `false`

The message generation can be overridden by using the `getMessage` option. It
should be a function using [`info` as argument](#event-info) and returning
a string.

# Skipping events

Events can be skipped with the `skipEvent` option. It should be a function
using [`info` as argument](#event-info) and returning `true` or `false`.

For example to skip `warning` events:

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
logProcessErrors({
  skipEvent({ eventName }) {
    return eventName === 'warning'
  },
})
```

# Event information

The options `log`, `getLevel`, `getMessage` and `skipEvent` all receive as
argument an `info` object with information about the event. It has the following
properties:

- `eventName` `{string}`: can be `uncaughtException`, `unhandledRejection`,
  `rejectionHandled`, `multipleResolves` or `warning`
- `error` `{any}`:
  - either the value thrown by `uncaughtException`
  - or the error emitted by `warning`.
    [`error.code` and `error.detail`](https://nodejs.org/api/process.html#process_event_warning)
    might be defined.
  - it is usually an `Error` instance but could technically be anything
- `promiseState` `{string}`: whether the promise was `resolved` or
  `rejected`
- `promiseValue` `{any}`: value resolved/rejected by the promise
- `secondPromiseState`, `secondPromiseValue`: like `promiseState` and
  `promiseValue` but for the second time the promise was resolved/rejected

Whether the properties above are defined or not depends on the event name:

- `eventName`: always present
- `error`: only on `uncaughtException` and `warning`
- `promiseState`, `promiseValue`: only on `unhandledRejection`,
  `rejectionHandled` and `multipleResolves`
- `secondPromiseState`, `secondPromiseValue`: only on `multipleResolves`

The following properties are also defined with the `getMessage` option:

- `level` `{string}`
- `colors` `{object}`: [Chalk instance](https://github.com/chalk/chalk#api)
  to colorize strings (disabled if the option `colors` is `false`)

# Stop logging

Logging can be stopped by firing the function returned by `logProcessErrors()`

<!-- eslint-disable no-empty-function, no-unused-vars, node/no-missing-require,
import/no-unresolved, unicorn/filename-case, strict, no-undef -->

```js
const logProcessErrors = require('log-process-errors/custom')

const stopLogging = logProcessErrors(options)

stopLogging()
```
