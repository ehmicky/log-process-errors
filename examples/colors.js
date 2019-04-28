// Demo of the `colors` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/colors.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const logProcessErrors = require('log-process-errors')

// Initialization
// Removes message colorization
logProcessErrors({ colors: false })

const { warning } = require('./errors.js')

// Emit a `warning` process error
warning()
