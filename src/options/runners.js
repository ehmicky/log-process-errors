'use strict'

const { nextTick } = require('process')

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
const throwUncaughtException = function(message) {
  nextTick(() => {
    const error = messageToError({ message })
    throw error
  })
}

// `message` is a stringified `Error`. We parse it back to an `Error` object.
const messageToError = function({ message }) {
  const [messageA, ...stack] = message.split('\n')
  const stackA = stack.join('\n')
  const error = new Error(messageA)
  // eslint-disable-next-line fp/no-mutation
  error.stack = stackA
  return error
}

// Options common to most runners
const COMMON_OPTIONS = {
  log: throwUncaughtException,
  // Most runners do their own colorization
  colors: false,
  // Other tests should keep running
  exitOn: [],
  // All runners need to report `uncaughtException` for `propagateError()` to
  // work. Most also report `unhandledRejection`.
  level: { uncaughtException: 'silent', unhandledRejection: 'silent' },
}

const RUNNERS = {
  ava: COMMON_OPTIONS,
  // Mocha does not report `unhandleRejection`
  mocha: { ...COMMON_OPTIONS, level: { uncaughtException: 'silent' } },
  jasmine: COMMON_OPTIONS,
  'node-tap': COMMON_OPTIONS,
}

module.exports = {
  RUNNERS,
}
