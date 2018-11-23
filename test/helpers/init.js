'use strict'

const sinon = require('sinon')

const { init } = require('../../build')

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
const startLoggingNoOpts = function() {
  const stopLogging = init()
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
  const getLevel = getLevelFunc({ level })
  const getMessage = getMessageFunc({ message })
  const skipEventA = getSkipEvent({ eventName, skipEvent })

  const stopLogging = init({
    log: logA,
    getLevel,
    getMessage,
    skipEvent: skipEventA,
    exitOn: [],
    ...opts,
  })
  return { stopLogging, log: logA, getLevel, getMessage }
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

// Get `opts.getLevel()`
const getLevelFunc = function({ level }) {
  if (level === undefined) {
    return
  }

  return sinon.spy(() => level)
}

// Get `opts.getMessage()`
const getMessageFunc = function({ message }) {
  if (message === undefined) {
    return
  }

  return sinon.spy(() => message)
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
