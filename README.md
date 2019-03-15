<img src="https://raw.githubusercontent.com/ehmicky/design/master/log-process-errors/log-process-errors.svg?sanitize=true" width="500"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors) [![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/log-process-errors) [![Node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js)](https://www.npmjs.com/package/log-process-errors) [![Gitter](https://img.shields.io/gitter/room/ehmicky/log-process-errors.svg?logo=gitter)](https://gitter.im/ehmicky/log-process-errors)

Show some ❤️ to process errors in Node.js.

Node.js prints process errors
([`uncaughtException`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`warning`](https://nodejs.org/api/process.html#process_event_warning),
[`unhandledRejection`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled))
on the console which is very useful. Unfortunately those errors:

- do not show stack traces for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning) and
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
  making them hard to debug.
- do not include
  [`multipleResolves`](https://nodejs.org/api/process.html#process_event_multipleresolves)
  errors (when a promise is resolved/rejected twice).
- are inconvenient to [log to an external service](docs/API.md#log).
- cannot be conditionally skipped.
- are printed each time an error is repeated (except for
  [`warning`](https://nodejs.org/api/process.html#process_event_warning)).
- are not human-friendly.

`log-process-errors` fixes all those issues.

Without `log-process-errors`:

![Screenshot before](docs/before.png)

With `log-process-errors`:

![Screenshot after](docs/after.png)

# Use cases

- Proper **logging** of process errors on a **production server**.
- Enhanced stack traces when **debugging** process errors.
- Ensuring no process errors are fired during automated **testing**.

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

- [`log` `{function}`](docs/API.md#log): customize how events are logged.
  Default: use `console.warn()`, `console.error()`, etc.
- [`level` `{object}`](docs/API.md#level): which log level to use. Default:
  `{ warning: 'warn', multipleResolves: 'info', default: 'error' }`.
- [`message` `{function}`](docs/API.md#message): customize messages.
- [`colors` `{boolean}`](docs/API.md#colors): colorize messages. Default: `true`
  if the output is a terminal.
- [`exitOn` `{string[]}`](docs/API.md#exiton): which events should trigger
  `process.exit(1)`. Default: `['uncaughtException']`.

Please see the [options full documentation](docs/API.md).

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

# Questions and feedback

Feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/log-process-errors) if you're
unclear about how to use this project.

If you found a bug or would like to request a new feature, please
[submit an issue on GitHub](../../issues) instead. Don't hesitate: this project
needs bug reports and feature requests to improve.

# Contributing

This project was made with love–it needs your love back! The best way to give
back is by starring this project and sharing it online.

If you found a typo please click on the `Edit` button (pencil icon) of the page
and submit a correction.

Pull requests are appreciated!

# Code of conduct

You are welcome to contribute to this project regardless of personal
background. We enforce a [Code of conduct](CODE_OF_CONDUCT.md) in order to
promote a positive and inclusive environment. Please read it before submitting
an issue or pull request.

# Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/log-process-errors/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/log-process-errors/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
