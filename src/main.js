import process from 'process'

import mem from 'mem'

import { EVENTS } from './handle/main.js'
import { emitLimitedWarning } from './limit.js'
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
  return Object.entries(EVENTS).map(([reason, eventFunc]) =>
    addListener(opts, reason, eventFunc),
  )
}

const addListener = function (opts, reason, eventFunc) {
  // `previousEvents` is reason-specific so that if events of a given event
  // stopped being emitted, others still are.
  // `previousEvents` can take up some memory, but it should be cleaned up
  // by `removeListener()`, i.e. once `eventListener` is garbage collected.
  const previousEvents = new Set()
  // Should only emit the warning once per `reason` and per `init()`
  const mEmitLimitedWarning = mem(emitLimitedWarning)

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
