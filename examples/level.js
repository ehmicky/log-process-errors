// Demo of the `level` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/level.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { multipleResolves, warning } from './errors.js'

// Initialization
// Changes which log level to use
logProcessErrors({
  level: {
    // Use `debug` log level for `multipleResolves` instead of `info`
    multipleResolves: 'debug',

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

// This `multipleResolves` process error will use a `debug` log level
multipleResolves()
