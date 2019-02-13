<img src="https://raw.githubusercontent.com/ehmicky/design/master/log-process-errors/log-process-errors.svg?sanitize=true" width="500"/>

[![downloads](https://img.shields.io/npm/dt/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![last commit](https://img.shields.io/github/last-commit/ehmicky/log-process-errors.svg?logo=github&logoColor=white)](https://github.com/ehmicky/log-process-errors/graphs/contributors) [![license](https://img.shields.io/badge/license-Apache%202.0-4cc61e.svg?logo=github&logoColor=white)](https://www.apache.org/licenses/LICENSE-2.0) [![Coverage Status](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=test%20coverage&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors) [![travis](https://img.shields.io/travis/ehmicky/log-process-errors/master.svg?logo=travis)](https://travis-ci.org/ehmicky/log-process-errors/builds) [![npm](https://img.shields.io/npm/v/log-process-errors.svg?logo=npm)](https://www.npmjs.com/package/log-process-errors) [![node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](#) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?logo=javascript)](https://standardjs.com) [![eslint-config-standard-prettier-fp](https://img.shields.io/badge/eslint-config--standard--prettier--fp-4cc61e.svg?logo=eslint&logoColor=white)](https://github.com/ehmicky/eslint-config-standard-prettier-fp) [![Gitter](https://img.shields.io/gitter/room/ehmicky/log-process-errors.svg?logo=gitter)](https://gitter.im/ehmicky/log-process-errors)

By default Node.js prints
[`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`warning`](https://nodejs.org/api/process.html#process_event_warning) and
mishandled promises
([`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves))
on the console which is very useful. Unfortunately those process errors:

- show neither stack traces nor promise values for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning),
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  and
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves) making it hard to debug.
- are inconvenient to [log to an external service](#custom-logging).
- are printed each time the exact same error is repeated (except for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning)).
- are not human-friendly.

![Screenshot before](docs/before.png)

`log-process-errors` fixes those issues:

![Screenshot after](docs/after.png)

# Installation

```bash
$ npm install log-process-errors
```

`log-process-errors` modifies logging globally. It should not be installed as
a production dependency inside libraries since users might not expect this side effect. Also this might lead to conflicts between libraries.

# Usage

There are two ways to load this library. The first is to use the
[`node -r` CLI flag](https://nodejs.org/api/cli.html#cli_r_require_module):

```bash
node -r log-process-errors/register ...
```

The second is:

<!-- eslint-disable-next-line import/newline-after-import -->

```js
const logProcessErrors = require('log-process-errors')
logProcessErrors(options)
```

`logProcessErrors()` should be called as early as possible in the code.

`options` is an optional object with the following properties:

- [`log` `{function}`](#custom-logging)
- [`level` `{object}`](#log-level)
- [`message` `{function}`](#log-message)
- [`colors` `{boolean}`](#log-message)
- [`exitOn` `{string[]}`](#process-exit)

# Custom logging

By default events will be logged to the console using `console.error()`,
`console.warn()`, etc.

This behavior can be overridden with the `log` option. For example to log events
with [Winston](https://github.com/winstonjs/winston) instead:

```js
logProcessErrors({
  log(message, level, info) {
    winstonLogger[level](message)
  },
})
```

The function's arguments are [`message`](#log-message) (string),
[`level`](#log-level) (string) and [`info`](#event-information) (object).

If logging is asynchronous, the function should return a promise (or use
`async`/`await`). This is not necessary if logging is using streams (like
[Winston](https://github.com/winstonjs/winston)).

Duplicate events are only logged once (whether the `log` option is defined or
not).

# Log level

The default log level is `warn` for
[`warning`](https://nodejs.org/api/process.html#process_event_warning),
`info` for
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves)
and `error` for the other events.

This can be overridden by using the `level` option. It should be an
object whose:

- keys are the event names among `default`,
  [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
  [`warning`](https://nodejs.org/api/process.html#process_event_warning),
  [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  or
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).
- values are the log level which can be:
  - a string among `debug`, `info`, `warn`, `error` or `silent`.
  - `undefined` to use the default value.
  - a function using [`info` as argument](#event-information) and
    returning a string or `undefined` (as above).

```js
logProcessErrors({
  // Use `debug` log level for `multipleResolves` instead of `info`
  level: { multipleResolves: 'debug' },
})
```

```js
logProcessErrors({
  // Skip some logs based on a condition
  level: {
    default() {
      if (shouldSkip()) {
        return 'silent'
      }
    },
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

The [`log`](#custom-logging), [`level`](#log-level) and
[`message`](#log-message) options all receive as argument an `info` object.

## `info.eventName`

String among
[`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves)
or
[`warning`](https://nodejs.org/api/process.html#process_event_warning).

## `info.error`

Either the value thrown by
[`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception)
or the error emitted by
[`warning`](https://nodejs.org/api/process.html#process_event_warning).
Not defined with other events. It is usually an `Error` instance but could be
anything.

## `info.promiseState`

String indicating whether the promise was `resolved` or `rejected`. Only
defined with
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
and
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

## `info.promiseValue`

Value resolved/rejected by the promise. Only defined with
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
and
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

## `info.secondPromiseState`, `info.secondPromiseValue`

Like [`promiseState`](#infopromisestate) and
[`promiseValue`](#infopromisevalue) but for the second time the promise was
resolved/rejected. Only defined with
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

## `info.level`

[Log level](#log-level). Only defined with the [`message` option](#log-message).

## `info.colors`

[Chalk instance](https://github.com/chalk/chalk#api) to colorize strings.
Only defined with the [`message` option](#log-message). Disabled if the
[`colors` option](#log-message) is `false`.

# Process exit

The `exitOn` option specifies which event should trigger `process.exit(1)`:

- the default value is `['uncaughtException']`. This is the
  [default behavior](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly)
  of Node.js.
- we recommend using `['uncaughtException', 'unhandledRejection']`
  instead since this will be the [future default behavior of Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections).
- to prevent any `process.exit(1)` use `[]`. Recommended if your process is
  long-running and does not automatically restart on exit.

`process.exit(1)` will only be fired after successfully logging the event.

# Stop logging

Logging can be stopped by firing the function returned by `logProcessErrors()`.

```js
const logProcessErrors = require('log-process-errors')

const stopLogging = logProcessErrors(options)

stopLogging()
```
