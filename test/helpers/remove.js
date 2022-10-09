import process from 'process'

import { EVENTS } from './events.js'

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
// We keep the default `warning` event listener so we can test it.
export const removeProcessListeners = function () {
  EVENTS.forEach(removeProcessListener)
}

const removeProcessListener = function (eventName) {
  if (eventName !== 'warning') {
    process.removeAllListeners(eventName)
  }
}
