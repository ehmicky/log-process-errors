import process from 'process'

import { EVENTS } from './emit/main.js'

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
export const removeProcessListeners = function() {
  Object.keys(EVENTS).forEach(name => {
    // We keep the default `warning` event listener so we can test it
    if (name === 'warning') {
      return
    }

    process.removeAllListeners(name)
  })
}
