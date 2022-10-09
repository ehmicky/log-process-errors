import process from 'process'

import { EVENTS } from './events.js'
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
  return Object.entries(EVENTS).map(([event, eventFunc]) =>
    addListener(opts, event, eventFunc),
  )
}

const addListener = function (opts, event, eventFunc) {
  const eventListener = eventFunc.bind(undefined, {
    opts,
    event,
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
