import process from 'process'

import { EVENT_DATA } from './events/main.js'

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
export const removeProcessListeners = function() {
  EVENT_DATA.forEach(({ eventName }) => {
    // We keep the default `warning` event listener so we can test it
    if (eventName === 'warning') {
      return
    }

    process.removeAllListeners(eventName)
  })
}
