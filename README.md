<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/log-process-errors/log-process-errors_dark.svg"/>
  <img alt="log-process-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/log-process-errors/log-process-errors.svg" width="500"/>
</picture>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/log-process-errors.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/log-process-errors)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/src/main.d.ts)
[![Node](https://img.shields.io/node/v/log-process-errors.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/log-process-errors)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

[📰 Medium article.](https://medium.com/@ehmicky/node-js-process-errors-are-broken-193980f0a77b)

Show some ❤️ to Node.js process errors.

This improves process errors:
[uncaught](https://nodejs.org/api/process.html#process_event_uncaughtexception)
exceptions,
[unhandled](https://nodejs.org/api/process.html#process_event_unhandledrejection)
promises, promises
[handled too late](https://nodejs.org/api/process.html#process_event_rejectionhandled)
and [warnings](https://nodejs.org/api/process.html#process_event_warning).

# Features

- Stack traces for warnings and
  [`rejectionHandled`](https://nodejs.org/api/process.html#process_event_rejectionhandled)
- [Single event handler](#onerror) for all process errors
- Ignore [duplicate](#onerror) process errors
- [Process exit](#exit) is graceful and can be prevented

# Install

Production code (e.g. a server) can install this either as a production or
development dependency:

```bash
npm install log-process-errors
```

However, libraries should install this as a development dependency:

```bash
npm install -D log-process-errors
```

This is because logging is modified globally and libraries users might not
expect this side-effect. Also, this might lead to conflicts between libraries.

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## logProcessErrors(options?)

[`options`](#options) `object?`\
_Return value_: `() => void`

Initializes `log-process-errors`.

```js
import logProcessErrors from 'log-process-errors'
logProcessErrors(options)
```

The return value restores Node.js default behavior.

```js
const restore = logProcessErrors(options)
restore()
```

## Options

### exit

_Type_: `boolean`

Whether to exit the process on
[uncaught exceptions](https://nodejs.org/api/process.html#process_event_uncaughtexception)
or
[unhandled promises](https://nodejs.org/api/process.html#process_event_unhandledrejection).

This is `false` by default if other libraries are listening to those events, so
they can perform the exit instead. Otherwise, this is `true`.

If some tasks are still ongoing, the exit waits for them to complete up to 3
seconds.

### onError

_Type_: `(error, event) => Promise<void> | void`\
_Default_: `console.error(error)`

Function called once per process error. Duplicate process errors are ignored.

```js
// Log process errors with Winston instead
logProcessErrors({
  onError(error, event) {
    winstonLogger.error(error.stack)
  },
})
```

#### error

_Type_: `Error`

The process error. This is guaranteed to be an error instance.

#### event

_Type_: `string`

Process event name among:
[`'uncaughtException'`](https://nodejs.org/api/process.html#process_event_uncaughtexception),
[`'unhandledRejection'`](https://nodejs.org/api/process.html#process_event_unhandledrejection),
[`'rejectionHandled'`](https://nodejs.org/api/process.html#process_event_rejectionhandled),
[`'warning'`](https://nodejs.org/api/process.html#process_event_warning).

# Related projects

- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2022 🔮
- [`error-custom-class`](https://github.com/ehmicky/error-custom-class): Create
  one error class
- [`error-class-utils`](https://github.com/ehmicky/error-class-utils): Utilities
  to properly create error classes
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`set-error-class`](https://github.com/ehmicky/set-error-class): Properly
  update an error's class
- [`set-error-message`](https://github.com/ehmicky/set-error-message): Properly
  update an error's message
- [`set-error-props`](https://github.com/ehmicky/set-error-props): Properly
  update an error's properties
- [`error-cause-polyfill`](https://github.com/ehmicky/error-cause-polyfill):
  Polyfill `error.cause`
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

Thanks go to our wonderful contributors:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt=""/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/log-process-errors/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/log-process-errors/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://svachon.com"><img src="https://avatars0.githubusercontent.com/u/170197?v=4" width="100px;" alt=""/><br /><sub><b>Steven Vachon</b></sub></a><br /><a href="#question-stevenvachon" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://github.com/Hongarc"><img src="https://avatars1.githubusercontent.com/u/19208123?v=4" width="100px;" alt=""/><br /><sub><b>Hongarc</b></sub></a><br /><a href="https://github.com/ehmicky/log-process-errors/commits?author=Hongarc" title="Documentation">📖</a> <a href="https://github.com/ehmicky/log-process-errors/commits?author=Hongarc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/abrenneke"><img src="https://avatars0.githubusercontent.com/u/342540?v=4" width="100px;" alt=""/><br /><sub><b>Andy Brenneke</b></sub></a><br /><a href="https://github.com/ehmicky/log-process-errors/issues?q=author%3Aabrenneke" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
