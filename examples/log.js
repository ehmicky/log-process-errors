// Demo of the `log` option.
// This file can be directly run:
//   - first install `log-process-errors`
//   - then `node node_modules/log-process-errors/examples/log.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/log-process-errors

import logProcessErrors from 'log-process-errors'

import { warning } from './errors.js'

// Initialization
// Customizes how events are logged
logProcessErrors({
  log(error, level) {
    console[level](error)
  },
})

// Emit a `warning` process error
warning()
