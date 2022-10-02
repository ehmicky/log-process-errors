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
  return Object.entries(EVENTS).map(([name, eventFunc]) =>
    addListener(opts, name, eventFunc),
  )
}

const addListener = function (opts, name, eventFunc) {
  // `previousEvents` is event-name-specific so that if events of a given event
  // stopped being emitted, others still are.
  // `previousEvents` can take up some memory, but it should be cleaned up
  // by `removeListener()`, i.e. once `eventListener` is garbage collected.
  const previousEvents = new Set()
  // Should only emit the warning once per event name and per `init()`
  const mEmitLimitedWarning = mem(emitLimitedWarning)

  const eventListener = eventFunc.bind(undefined, {
    opts,
    name,
    previousEvents,
    mEmitLimitedWarning,
  })
  process.on(name, eventListener)

  return { eventListener, name }
}

// Remove all event handlers and restore previous `warning` listeners
const stopLogProcessErrors = function (listeners) {
  listeners.forEach(removeListener)
  restoreWarningListener()
}

const removeListener = function ({ eventListener, name }) {
  process.off(name, eventListener)
}
