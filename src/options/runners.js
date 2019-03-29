'use strict'

const { nextTick } = require('process')

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
// `message` is a stringified `Error`. We parse it back to an `Error` object.
const propagateError = function(message) {
  nextTick(() => {
    const [messageA, ...stack] = message.split('\n')
    const stackA = stack.join('\n')
    const error = new Error(messageA)
    // eslint-disable-next-line fp/no-mutation
    error.stack = stackA
    throw error
  })
}

// Some test runners like Jasmine print both `Error.message` and `Error.stack`,
// which leads to duplicate stack traces.
const propagateString = function(message) {
  nextTick(() => {
    throw message
  })
}

// Options common to most runners
const COMMON_OPTIONS = {
  log: propagateError,
  // Most runners do their own colorization
  colors: false,
  // Other tests should keep running
  exitOn: [],
  // All runners need to report `uncaughtException` for `propagateError()` to
  // work. Most also report `unhandledRejection`
  level: { uncaughtException: 'silent', unhandledRejection: 'silent' },
}

const RUNNERS = {
  ava: COMMON_OPTIONS,
  // Mocha does not report `unhandleRejection`
  mocha: { ...COMMON_OPTIONS, level: { uncaughtException: 'silent' } },
  jasmine: { ...COMMON_OPTIONS, log: propagateString },
  'node-tap': COMMON_OPTIONS,
}

module.exports = {
  RUNNERS,
}
