import process from 'process'

import { EVENTS, handleEvent } from './events.js'
import { getOptions } from './options.js'
import { removeWarningListener, restoreWarningListener } from './warnings.js'

// Add event handling for all process-related errors
export default function logProcessErrors(opts) {
  const optsA = getOptions(opts)
  removeWarningListener()
  const listeners = addListeners(optsA)
  return stopLogProcessErrors.bind(undefined, listeners)
}

const addListeners = function (opts) {
  return EVENTS.map((event) => addListener(event, opts))
}

const addListener = function (event, opts) {
  const eventListener = handleEvent.bind(undefined, {
    event,
    opts,
    previousEvents: [],
  })
  process.on(event, eventListener)
  return { eventListener, event }
}

// Remove all event handlers and restore previous `warning` listeners
const stopLogProcessErrors = function (listeners) {
  listeners.forEach(removeListener)
  restoreWarningListener()
}

const removeListener = function ({ eventListener, event }) {
  process.off(event, eventListener)
}
