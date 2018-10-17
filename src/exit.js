'use strict'

const { exit } = require('process')
const { promisify } = require('util')

// Exit process according to `opts.exitOn` (default: ['uncaughtException']):
//  - `uncaughtException`: default behavior of Node.js and recommended by https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
//  - `unhandledRejection`: possible future behavior and recommended by Node.js.
//    See https://nodejs.org/dist/latest-v8.x/docs/api/deprecations.html#deprecations_dep0018_unhandled_promise_rejections
// By default `unhandledRejection` is opt-in so that using this library does not
// decrease stability (if the application does not restart on exit).
const exitProcess = async function({ eventName, opts: { exitOn } }) {
  if (!exitOn.includes(eventName)) {
    return
  }

  // This is only needed as a safety measure
  await promisify(setTimeout)(EXIT_TIMEOUT)

  exit(EXIT_STATUS)
}

const EXIT_TIMEOUT = 3e3
const EXIT_STATUS = 1

module.exports = {
  exitProcess,
}
