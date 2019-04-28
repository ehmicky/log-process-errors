// Demonstrates how to restore Node.js default behavior after using
// `log-process-errors`.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/restore.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const logProcessErrors = require('log-process-errors')

// Initialization
const restore = logProcessErrors()

const { warning } = require('./errors.js')

// Emit a process error while `log-process-errors` is enabled
warning()

setTimeout(() => {
  // Restore Node.js default behavior
  restore()

  // Emit another process error while `log-process-errors` is not enabled
  warning()
}, 0)
