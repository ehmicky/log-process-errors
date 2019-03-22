// Demo of the `message` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/message.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
// eslint-disable-next-line import/no-unassigned-import
require('./utils')

const logProcessErrors = require('log-process-errors')

// Initialization
// Overrides the default message generation
logProcessErrors({
  // Log events as JSON instead
  message(level, event) {
    return JSON.stringify(event)
  },
})

const { warning } = require('./errors')

// Emit a `warning` process error
warning()
