import process from 'process'

import { EVENTS } from './events.js'

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
export const removeProcessListeners = function () {
  EVENTS.forEach(({ eventName }) => {
    // We keep the default `warning` event listener so we can test it
    if (eventName === 'warning') {
      return
    }

    process.removeAllListeners(eventName)
  })
}
