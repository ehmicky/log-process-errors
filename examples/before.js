#!/usr/bin/env node
// Demonstrates how process errors look when `log-process-errors` is not
// used, in JavaScript.
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
} = require('./errors')

// Emit different types of process errors.
uncaughtException()
unhandledRejection()
warning()
multipleResolves()
