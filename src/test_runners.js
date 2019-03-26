'use strict'

const { nextTick } = require('process')

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
const propagateError = function(message) {
  nextTick(() => {
    throw new Error(message)
  })
}

// Most test runners already handle `uncaughtException` and `unhandledRejection`
const DEFAULT_LEVELS = {
  uncaughtException: 'silent',
  unhandledRejection: 'silent',
  default: 'error',
}

const TEST_RUNNERS = {
  ava: {
    log: propagateError,
    level: DEFAULT_LEVELS,
    // Other tests should keep running
    exitOn: [],
    // Using `colors: true` somehow messes up Ava output
    colors: false,
  },
}

module.exports = {
  TEST_RUNNERS,
}
