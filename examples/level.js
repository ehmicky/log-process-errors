// Demo of the `level` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/level.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { warning, uncaughtException } from './errors.js'

// Initialization
// Changes which log level to use
logProcessErrors({
  level: {
    // Use `debug` log level for `uncaughtException` instead of `error`
    uncaughtException: 'debug',

    // Skip some logs based on a condition
    default(error) {
      return shouldSkip(error) ? 'silent' : 'default'
    },
  },
})

// Skip deprecation warnings
const shouldSkip = function ({ message }) {
  return message.includes('Deprecation')
}

// This deprecation `warning` will be silent
warning()

// This `uncaughtException` process error will use a `debug` log level
uncaughtException()
