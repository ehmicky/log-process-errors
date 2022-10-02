import process from 'process'

import { EVENTS } from './handle.js'
import { getEmitLimitedWarning } from './limit.js'
import { getOptions } from './options.js'
import { getPreviousEvents } from './repeat.js'
import { removeWarningListener, restoreWarningListener } from './warnings.js'

// Add event handling for all process-related errors
export default function logProcessErrors(opts) {
  const optsA = getOptions(opts)
  removeWarningListener()
  const listeners = addListeners(optsA)
  return stopLogProcessErrors.bind(undefined, listeners)
}

const addListeners = function (opts) {
  return Object.entries(EVENTS).map(([reason, eventFunc]) =>
    addListener(opts, reason, eventFunc),
  )
}

const addListener = function (opts, reason, eventFunc) {
  const previousEvents = getPreviousEvents()
  const mEmitLimitedWarning = getEmitLimitedWarning()
  const eventListener = eventFunc.bind(undefined, {
    opts,
    reason,
    previousEvents,
    mEmitLimitedWarning,
  })
  process.on(reason, eventListener)
  return { eventListener, reason }
}

// Remove all event handlers and restore previous `warning` listeners
const stopLogProcessErrors = function (listeners) {
  listeners.forEach(removeListener)
  restoreWarningListener()
}

const removeListener = function ({ eventListener, reason }) {
  process.off(reason, eventListener)
}
