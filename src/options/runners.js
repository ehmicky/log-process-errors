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

// `tape` does not handle `uncaughtExceptions`. We create a new failing test
// to do it instead.
const tapeFailingTest = function(message) {
  const error = messageToError({ message })

  // This is an optional peerDependency. `package.json` does not support those.
  // eslint-disable-next-line import/no-extraneous-dependencies
  const tape = require('tape')
  tape.test(error.message, t => {
    t.plan(1)
    t.error(error)
  })
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
  // Mocha does not report `uncaughtException` nor `unhandleRejection`
  tape: { ...COMMON_OPTIONS, level: {}, log: tapeFailingTest },
  'node-tap': COMMON_OPTIONS,
}

module.exports = {
  RUNNERS,
}
