// Demonstrates how process errors look **with** `log-process-errors`.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/after.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { uncaughtException, unhandledRejection, warning } from './errors.js'

// Initialization
logProcessErrors()

// Emit different types of process errors
uncaughtException()
unhandledRejection()
warning()
