// Demo of the `colors` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/colors.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { warning } from './errors.js'

// Initialization
// Removes message colorization
logProcessErrors({ colors: false })

// Emit a `warning` process error
warning()
