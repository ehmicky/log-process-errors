'use strict'

const sinon = require('sinon')

const logProcessErrors = require('../..')

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
const startLoggingNoOpts = function() {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}

const startLogging = function({
  eventName,
  skipEvent,
  log,
  level,
  message,
  ...opts
} = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level })
  const messageA = getMessage({ message })
  const skipEventA = getSkipEvent({ eventName, skipEvent })

  const stopLogging = logProcessErrors({
    log: logA,
    level: levelA,
    message: messageA,
    skipEvent: skipEventA,
    exitOn: [],
    ...opts,
  })
  return { stopLogging, log: logA, level: levelA, message: messageA }
}

// Get `opts.log()`
const getLog = function({ log }) {
  if (log === 'default') {
    return
  }

  if (log === 'spy') {
    return sinon.spy()
  }

  if (log === undefined) {
    return noop
  }

  return log
}

// eslint-disable-next-line no-empty-function
const noop = function() {}

// Get `opts.level()`
const getLevel = function({ level }) {
  if (typeof level === 'string') {
    return sinon.spy(() => level)
  }

  if (typeof level !== 'function') {
    return level
  }

  return sinon.spy(level)
}

// Get `opts.message()`
const getMessage = function({ message }) {
  if (typeof message === 'string') {
    return sinon.spy(() => message)
  }

  if (typeof message !== 'function') {
    return message
  }

  return sinon.spy(message)
}

// Get `opts.skipEvent()`
const getSkipEvent = function({ eventName, skipEvent }) {
  if (eventName === undefined) {
    return skipEvent
  }

  return onlyEvent.bind(null, eventName)
}

const onlyEvent = function(eventName, info) {
  return info.eventName !== eventName
}

module.exports = {
  startLoggingNoOpts,
  startLogging,
}
