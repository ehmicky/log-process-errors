// eslint-disable-next-line filenames/match-exported
'use strict'

const process = require('process')

const moize = require('moize').default

const { getOptions } = require('./options')
const { removeWarningListener, restoreWarningListener } = require('./warnings')
const EVENTS = require('./events')
const { emitLimitedWarning } = require('./limit')

// Add event handling for all process-related errors
const logProcessErrors = function(opts) {
  const optsA = getOptions({ opts })

  removeWarningListener()

  const listeners = addListeners({ opts: optsA })

  // Do not use `function.bind()` to keep the right `function.name`
  const stopLogProcessErrors = () => stopLogging(listeners)
  return stopLogProcessErrors
}

const addListeners = function({ opts }) {
  return Object.entries(EVENTS).map(([name, eventFunc]) =>
    addListener({ opts, name, eventFunc }),
  )
}

const addListener = function({ opts, name, eventFunc }) {
  // `previousEvents` is event-name-specific so that if events of a given event
  // stopped being emitted, others still are.
  // `previousEvents` can take up some memory, but it should be cleaned up
  // by `removeListener()`, i.e. once `eventListener` is garbage collected.
  const previousEvents = new Set()
  // Should only emit the warning once per event name and per `init()`
  const mEmitLimitedWarning = moize(emitLimitedWarning)

  const eventListener = eventFunc.bind(null, {
    opts,
    name,
    previousEvents,
    mEmitLimitedWarning,
  })
  process.on(name, eventListener)

  return { eventListener, name }
}

// Remove all event handlers and restore previous `warning` listeners
const stopLogging = function(listeners) {
  listeners.forEach(removeListener)
  restoreWarningListener()
}

const removeListener = function({ eventListener, name }) {
  // TODO: use `process.off()` instead of `process.removeListener()`
  // after dropping Node.js <10 support
  process.removeListener(name, eventListener)
}

module.exports = logProcessErrors
