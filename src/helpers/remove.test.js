import process from 'node:process'

import { EVENTS } from './events.test.js'

// Ava sets up process `uncaughtException` and `unhandledRejection` handlers
// which makes testing them harder.
// We keep the default `warning` event listener so we can test it.
export const removeProcessListeners = () => {
  EVENTS.forEach(removeProcessListener)
}

const removeProcessListener = (eventName) => {
  if (eventName !== 'warning') {
    process.removeAllListeners(eventName)
  }
}
