// Demonstrates how to restore Node.js default behavior after using
// `log-process-errors`.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/restore.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { warning } from './errors.js'

// Initialization
const restore = logProcessErrors()

// Emit a process error while `log-process-errors` is enabled
warning()

setTimeout(() => {
  // Restore Node.js default behavior
  restore()

  // Emit another process error while `log-process-errors` is not enabled
  warning()
}, 0)
