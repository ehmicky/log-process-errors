// Demo of the `exitOn` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/exit.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { unhandledRejection } from './errors.js'

// Initialization
// Changes which events should trigger `process.exit(1)`
logProcessErrors({ exitOn: ['uncaughtException', 'unhandledRejection'] })

// Emitting a `unhandledRejection` process error will exit the process
unhandledRejection()
