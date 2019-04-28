// Demonstrates how process errors look **with** `log-process-errors`,
// in JavaScript.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/after.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const logProcessErrors = require('log-process-errors')

// Initialization
logProcessErrors()

const {
  uncaughtException,
  unhandledRejection,
  warning,
  multipleResolves,
} = require('./errors.js')

// Emit different types of process errors
uncaughtException()
unhandledRejection()
warning()
multipleResolves()
