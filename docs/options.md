# Options

Options are passed as an optional object:

<!-- eslint-disable-next-line import/newline-after-import -->

```js
const logProcessErrors = require('log-process-errors')
logProcessErrors(options)
```

## options.log `{string}`

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

## options.level `{object}`

Which log level to use. It should be an object whose:

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

Default: `{ warning: 'warn', multipleResolves: 'info', default: 'error' }`.

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

## options.message `{function}`

Override the default message generation. It should be a function using
[`info` as argument](#event-information) and returning a string.

By default a nice-looking and descriptive log message is generated.

## options.colors `{boolean}`

Colorize the default [`options.message`](#optionsmessagefunction). Default:
`true`.

## options.exitOn `{string[]}`

Which events should trigger `process.exit(1)`:

- the default value is `["uncaughtException"]`. This is the
  [default behavior](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly)
  of Node.js.
- we recommend using `["uncaughtException", "unhandledRejection"]`
  instead since this will be the [future default behavior of Node.js](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections).
- to prevent any `process.exit(1)` use `[]`. Recommended if your process is
  long-running and does not automatically restart on exit.

`process.exit(1)` will only be fired after successfully logging the event.

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
