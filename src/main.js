'use strict'

const process = require('process')

const { defaultHandler } = require('./default')
const EVENTS = require('./events')

// Add event handling for all process-related errors
const setup = function(handlerFunc = defaultHandler) {
  const listeners = addListeners({ handlerFunc })
  const removeAll = removeListeners.bind(null, listeners)
  return removeAll
}

const addListeners = function({ handlerFunc }) {
  return Object.entries(EVENTS).map((eventName, eventFunc) =>
    addListener({ handlerFunc, eventName, eventFunc }),
  )
}

const addListener = function({ handlerFunc, eventName, eventFunc }) {
  const eventListener = eventFunc.bind(null, { handlerFunc, eventName })
  process.on(eventName, eventListener)

  return { eventListener, eventName }
}

// Remove all event handlers
const removeListeners = function(listeners) {
  listeners.forEach(removeListener)
}

const removeListener = function({ eventListener, eventName }) {
  // TODO: use `process.off()` instead of `process.removeListener()`
  // after dropping Node.js <10 support
  process.removeListener(eventName, eventListener)
}

module.exports = {
  setup,
}
