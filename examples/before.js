// Demonstrates how process errors look by default
// **without** `log-process-errors`, in JavaScript.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/before.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

const {
  uncaughtException,
  unhandledRejection,
  warning,
  multipleResolves,
} = require('./errors.js')

// Emit different types of process errors.
uncaughtException()
unhandledRejection()
warning()
multipleResolves()
