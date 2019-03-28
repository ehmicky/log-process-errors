'use strict'

const { nextTick } = require('process')

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
const propagateError = function(message) {
  nextTick(() => {
    throw new Error(message)
  })
}

// Options common to most runners
const LOOSE_OPTIONS = {
  log: propagateError,
  // All runners need to report `uncaughtException` for `propagateError()` to
  // work
  level: { uncaughtException: 'silent' },
  // Other tests should keep running
  exitOn: [],
}

// Same but for runners that also report `unhandleRejection`
const STRICT_OPTIONS = {
  ...LOOSE_OPTIONS,
  level: { ...LOOSE_OPTIONS.level, unhandledRejection: 'silent' },
}

const RUNNERS = {
  ava: {
    ...STRICT_OPTIONS,
    // Using `colors: true` somehow messes up Ava output
    colors: false,
  },
}

module.exports = {
  RUNNERS,
}
