import { nextTick } from 'process'

// Make `opts.log()` propagate an `uncaughtException` so that test runner
// reports the original process error as a test failure.
const throwUncaughtException = function (error) {
  nextTick(() => {
    throw error
  })
}

// `tape` does not handle `uncaughtExceptions`. We create a new failing test
// to do it instead.
const tapeFailingTest = async function (error) {
  // This is an optional peerDependency. `package.json` does not support those.
  const tape = await import('tape')
  tape.test(error.message, (t) => {
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
  // All runners need to report `uncaughtException` for
  // `throwUncaughtException()` to work. Most also report `unhandledRejection`.
  level: {
    uncaughtException: 'silent',
    unhandledRejection: 'silent',
  },
}

export const RUNNERS = {
  ava: COMMON_OPTIONS,
  // Mocha does not report `unhandledRejection`
  mocha: { ...COMMON_OPTIONS, level: { uncaughtException: 'silent' } },
  jasmine: COMMON_OPTIONS,
  // Tape does not report `uncaughtException` nor `unhandledRejection`
  tape: { ...COMMON_OPTIONS, level: {}, log: tapeFailingTest },
  node_tap: COMMON_OPTIONS,
}
