'use strict'

const { emitWarning } = require('process')

const { MAX_EVENTS } = require('./constants')

// We only allow 100 events (per `eventName`) for the global process because:
//  - process errors are exceptional and if more than 100 happen, this is
//    probably due to some infinite recursion.
//  - the `repeated` logic should prevent reaching the threshold
//  - `previousEvents` might otherwise take too much memory and/or create a
//    memory leak.
//  - it prevents infinite recursions if `opts.log|level|message()` triggers
//    itself an event.
//    The `repeated` logic should prevent it most of the times, but it can still
//    happen when `[next]Value` is not an `Error` instance and contain dynamic
//    content.
const isLimited = function({
  previousEvents,
  mEmitLimitedWarning,
  eventName,
  value,
}) {
  if (isLimitedWarning({ eventName, value })) {
    return false
  }

  const isLimitedEvent = [...previousEvents].length >= MAX_EVENTS

  if (isLimitedEvent) {
    mEmitLimitedWarning(eventName)
  }

  return isLimitedEvent
}

// Notify that limit has been reached with a `warning` event
const emitLimitedWarning = function(eventName) {
  emitWarning(ERROR_MESSAGE(eventName), ERROR_NAME, ERROR_CODE)
}

// The `warning` itself should not be skipped
const isLimitedWarning = function({ eventName, value: { name, code } = {} }) {
  return eventName === 'warning' && name === ERROR_NAME && code === ERROR_CODE
}

const ERROR_MESSAGE = eventName =>
  `Cannot log more than ${MAX_EVENTS} '${eventName}' until process is restarted`
const ERROR_NAME = 'LogProcessErrors'
const ERROR_CODE = 'TooManyErrors'

module.exports = {
  isLimited,
  emitLimitedWarning,
  isLimitedWarning,
}
