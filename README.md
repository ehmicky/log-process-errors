<img src="https://raw.githubusercontent.com/ehmicky/design/master/log-process-errors/log-process-errors.svg?sanitize=true" width="500"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors) [![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/log-process-errors) [![Node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](https://www.npmjs.com/package/log-process-errors) [![Gitter](https://img.shields.io/gitter/room/ehmicky/log-process-errors.svg?logo=gitter)](https://gitter.im/ehmicky/log-process-errors)

Show some ❤️ to process errors in Node.js.

Node.js prints process errors
([`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`warning`](https://nodejs.org/api/process.html#process_event_warning),
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves))
on the console which is very useful. Unfortunately those errors:

- show neither stack traces nor promise values for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning),
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  and
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves) making it hard to debug.
- are inconvenient to
  [log to an external service](docs/options.md#optionslog-string).
- cannot be conditionally skipped.
- are printed each time an error is repeated (except for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning)).
- are not human-friendly.

`log-process-errors` fixes all those issues.

Without `log-process-errors`:

![Screenshot before](docs/before.png)

With `log-process-errors`:

![Screenshot after](docs/after.png)

# Install

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

# Options

`options` is an optional object with the following properties:

- [`log` `{function}`](docs/options.md#optionslog-string): customize how events
  are logged. Default: use `console.warn()`, `console.error()`, etc.
- [`level` `{object}`](docs/options.md#optionslevel-object): which log level to
  use. Default: `{ warning: 'warn', multipleResolves: 'info', default: 'error' }`.
- [`message` `{function}`](docs/options.md#optionsmessage-function): customize
  messages.
- [`colors` `{boolean}`](docs/options.md#optionscolors-boolean): colorize
  messages. Default: `true`.
- [`exitOn` `{string[]}`](docs/options.md#optionsexiton-string): which events
  should trigger `process.exit(1)`. Default: `['uncaughtException']`.

Please see the [options full documentation](docs/options.md).

Full example:

<!-- eslint-disable no-empty-function -->

```js
logProcessErrors({
  log(message, level, event) {
    winstonLogger[level](message)
  },

  level: { multipleResolves: 'debug' },

  message(level, event, options) {},

  colors: false,

  exitOn: ['uncaughtException', 'unhandledRejection'],
})
```
