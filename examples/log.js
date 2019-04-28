// Demo of the `log` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/log.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const logProcessErrors = require('log-process-errors')

// Initialization
// Customizes how events are logged
logProcessErrors({
  log(error, level) {
    console[level](error)
  },
})

const { warning } = require('./errors.js')

// Emit a `warning` process error
warning()
