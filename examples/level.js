// Demo of the `level` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/level.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
// eslint-disable-next-line import/no-unassigned-import
require('./utils')

const logProcessErrors = require('log-process-errors')

// Initialization
// Changes which log level to use
logProcessErrors({
  level: {
    // Use `debug` log level for `multipleResolves` instead of `info`
    multipleResolves: 'debug',

    // Skip some logs based on a condition
    default(event) {
      return shouldSkip(event) ? 'silent' : 'default'
    },
  },
})

// Skip deprecation warnings
const shouldSkip = function(event) {
  const error = event.value
  return error instanceof Error && error.name.includes('Deprecation')
}

const { multipleResolves, warning } = require('./errors')

// This deprecation `warning` will be silent
warning()

// This `multipleResolves` process error will use a `debug` log level
multipleResolves()
