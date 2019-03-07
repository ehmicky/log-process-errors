# API

## logProcessErrors([options])

Initialize `log-process-errors`. Returns a function that can be fired to restore
Node.js default behavior.

<!-- eslint-disable-next-line import/newline-after-import -->

```js
const logProcessErrors = require('log-process-errors')
const restore = logProcessErrors(options)
restore()
```

### options

_Type_: `object`

#### log

_Type_: `function(message, level, event)`

By default events will be logged to the console using `console.error()`,
`console.warn()`, etc.

This behavior can be overridden with the `log` option. For example to log events
with [Winston](https://github.com/winstonjs/winston) instead:

```js
logProcessErrors({
  log(message, level, event) {
    winstonLogger[level](message)
  },
})
```

The function's arguments are [`message`](#optionsmessage-function) (string),
[`level`](#optionslevel-object) (string) and [`event`](#event) (object).

If logging is asynchronous, the function should return a promise (or use
`async`/`await`). This is not necessary if logging is using streams (like
[Winston](https://github.com/winstonjs/winston)).

Duplicate events are only logged once (whether the `log` option is defined or
not).

#### level

_Type_: `object`

_Default_: `{ warning: 'warn', multipleResolves: 'info', default: 'error' }`.

Which log level to use.

Object keys are the event names:
[`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`warning`](https://nodejs.org/api/process.html#process_event_warning),
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves)
or `default`.

Object values are the log level: `"debug"`, `"info"`, `"warn"`, `"error"`,
`"silent"` or `"default"`. It can also be a function using
[`event` as argument](#event) and returning one of those log levels.

```js
// Use `debug` log level for `multipleResolves` instead of `info`
logProcessErrors({
  level: { multipleResolves: 'debug' },
})
```

```js
// Skip some logs based on a condition
logProcessErrors({
  level: {
    default() {
      return shouldSkip() ? 'silent' : 'default'
    },
  },
})
```

#### message

_Type_: `function(level, event, options) => string`

_Default_: generate a nice-looking and descriptive log message.

Override the default message generation. Arguments are
[`level`](#optionslevel-object), [`event`](#event) and [`options`](#options).

#### colors

_Type_: `boolean`

_Default_: `true` if the output is a terminal.

Colorize the default [`options.message`](#optionsmessage-function).

#### exitOn

_Type_: `string[]`

_Default_: `["uncaughtException"]`

Which events should trigger `process.exit(1)`:

- `["uncaughtException"]` is Node.js
  [default behavior](https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly).
- we recommend using `["uncaughtException", "unhandledRejection"]`
  instead since this will be [Node.js future default behavior](https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections).
- to prevent any `process.exit(1)` use `[]`. Recommended if your process is
  long-running and does not automatically restart on exit.

`process.exit(1)` will only be fired after successfully logging the event.

### event

_Type_: `object`

The [`log`](#optionslog-string), [`level`](#optionslevel-object) and
[`message`](#optionsmessage-function) options all receive as argument an `event`
object.

#### event.name

_Type_: `string`

Can be
[`"uncaughtException"`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`"unhandledRejection"`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`"rejectionHandled"`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`"multipleResolves"`](https://nodejs.org/api/process.html#process_event_multipleresolves)
or
[`"warning"`](https://nodejs.org/api/process.html#process_event_warning).

#### event.value

_Type_: `any` (usually an `Error` instance but not always)

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

#### event.rejected

_Type_: `boolean`

Whether the promise was initially resolved or rejected. Only defined with
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).

#### event.nextValue, event.nextRejected

Like [`value`](#eventvalue) and [`rejected`](#eventrejected) but for
the second time the promise was resolved/rejected. Only defined with
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves).