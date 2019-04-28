// Demo of the `exitOn` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/exit.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const logProcessErrors = require('log-process-errors')

// Initialization
// Changes which events should trigger `process.exit(1)`
logProcessErrors({ exitOn: ['uncaughtException', 'unhandledRejection'] })

const { unhandledRejection } = require('./errors.js')

// Emitting a `unhandledRejection` process error will exit the process
unhandledRejection()
