'use strict'

const { nextTick } = require('process')

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
const propagateError = function(message) {
  nextTick(() => {
    throw new Error(message)
  })
}

// Some test runners like Jasmine print both `Error.message` and `Error.stack`,
// which leads to duplicate stack traces.
const propagateString = function(message) {
  nextTick(() => {
    throw message
  })
}

// Same but for test runners that do not print Error strings nicely.
const propagateStack = function(message) {
  nextTick(() => {
    const error = new Error('')
    // eslint-disable-next-line fp/no-mutation
    error.stack = message
    throw error
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
  // Using `colors: true` somehow messes up Ava output
  ava: { ...STRICT_OPTIONS, colors: false },
  mocha: { ...LOOSE_OPTIONS, log: propagateStack, colors: false },
  jasmine: { ...STRICT_OPTIONS, log: propagateString },
}

module.exports = {
  RUNNERS,
}
