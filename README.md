<img src="https://raw.githubusercontent.com/ehmicky/design/master/log-process-errors/log-process-errors.svg?sanitize=true" width="500"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors) [![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/log-process-errors) [![Node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](https://www.npmjs.com/package/log-process-errors) [![Gitter](https://img.shields.io/gitter/room/ehmicky/log-process-errors.svg?logo=gitter)](https://gitter.im/ehmicky/log-process-errors)

Show some ❤️ to process errors in Node.js.

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
- cannot be conditionally skipped
- are printed each time an error is repeated (except for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning)).
- are not human-friendly.

Without `log-process-errors`:

![Screenshot before](docs/before.png)

`log-process-errors` fixes those issues:

![Screenshot after](docs/after.png)

# Installation

Production code (e.g. a web server) can install this either as a production or
development dependency:

```bash
npm install log-process-errors
```

However libraries should install this as a development dependency:

```bash
npm install -D log-process-errors
```

This is because logging is modified globally and libraries users might not
expect this side-effect. Also this might lead to conflicts between libraries.

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

- keys are the event names among `"default"`,
  [`"uncaughtException"`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
  [`"warning"`](https://nodejs.org/api/process.html#process_event_warning),
  [`"unhandledRejection"`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
  [`"rejectionHandled"`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  or
  [`"multipleResolves"`](https://nodejs.org/api/process.html#process_event_multipleresolves).
- values are the log level which can be:
  - a string among `"debug"`, `"info"`, `"warn"`, `"error"` or `"silent"`.
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

Can be
[`"uncaughtException"`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`"unhandledRejection"`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`"rejectionHandled"`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`"multipleResolves"`](https://nodejs.org/api/process.html#process_event_multipleresolves)
or
[`"warning"`](https://nodejs.org/api/process.html#process_event_warning).

## `info.value`

Value:

- thrown by
  [`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception).
- resolved/rejected by the promise with
  [`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  and
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).
- emitted by
  [`warning`](https://nodejs.org/api/process.html#process_event_warning).

It is usually an `Error` instance but could be anything.

## `info.rejected`

Boolean indicating whether the promise was initially resolved or rejected. Only
defined with
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

## `info.nextValue`, `info.nextRejected`

Like [`value`](#infovalue) and [`rejected`](#inforejected) but for
the second time the promise was resolved/rejected. Only defined with
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

## `info.level`

[Log level](#log-level). Only defined with the [`message` option](#log-message).

## `info.colors`

[Chalk instance](https://github.com/chalk/chalk#api) to colorize strings.
Only defined with the [`message` option](#log-message). Disabled if the
[`colors` option](#log-message) is `false`.

# Process exit

The `exitOn` option specifies which event should trigger `process.exit(1)`:

- the default value is `["uncaughtException"]`. This is the
  [default behavior](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly)
  of Node.js.
- we recommend using `["uncaughtException", "unhandledRejection"]`
  instead since this will be the [future default behavior of Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections).
- to prevent any `process.exit(1)` use `[]`. Recommended if your process is
  long-running and does not automatically restart on exit.

`process.exit(1)` will only be fired after successfully logging the event.

# Restoring default behavior

Node.js default behavior can be restored by firing the function returned by
`logProcessErrors()`.

```js
const restore = logProcessErrors(options)
restore()
```
