'use strict'

// Do not destructure so tests can stub it
const process = require('process')

// Exit process according to `opts.exitOn` (default: ['uncaughtException']):
//  - `uncaughtException`: default behavior of Node.js and recommended by https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
//  - `unhandledRejection`: possible future behavior and recommended by Node.js.
//    See https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections
// By default `unhandledRejection` is opt-in so that using this library does not
// decrease stability (if the application does not restart on exit).
const exitProcess = function({ eventName, opts: { exitOn } }) {
  if (!exitOn.includes(eventName)) {
    return
  }

  // This is only needed as a safety measure
  // TODO: use `promisify` instead after
  // https://github.com/sinonjs/lolex/issues/223 is fixed
  setTimeout(() => {
    // eslint-disable-next-line unicorn/no-process-exit, no-process-exit
    process.exit(EXIT_STATUS)
  }, EXIT_TIMEOUT)
}

const EXIT_TIMEOUT = 3e3
const EXIT_STATUS = 1

module.exports = {
  exitProcess,
  EXIT_TIMEOUT,
}
