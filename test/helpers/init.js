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
  log,
  level,
  rawLevel = false,
  message,
  ...opts
} = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level, rawLevel, eventName })
  const messageA = getMessage({ message })

  const stopLogging = logProcessErrors({
    log: logA,
    level: levelA,
    message: messageA,
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
const getLevel = function({ level, rawLevel, eventName }) {
  // Invalid `opts.level`
  if (typeof level === 'boolean') {
    return level
  }

  if (rawLevel) {
    return level
  }

  const levelA = getLevelFunc({ level })

  const levelB = addEventFilter({ level: levelA, eventName })

  return sinon.spy(levelB)
}

// Always wrap in a function so we can spy it
const getLevelFunc = function({ level }) {
  if (typeof level === 'function') {
    return level
  }

  return () => level
}

// If `eventName` is specified, only print those events
const addEventFilter = function({ level, eventName }) {
  if (eventName === undefined) {
    return level
  }

  return onlyEvent.bind(null, { level, eventName })
}

const onlyEvent = function({ level, eventName }, info) {
  if (info.eventName !== eventName) {
    return 'silent'
  }

  return level(info)
}

// Get `opts.message()`
const getMessage = function({ message }) {
  if (typeof message === 'string') {
    return sinon.spy(() => message)
  }

  // Invalid `opts.message`
  if (typeof message !== 'function') {
    return message
  }

  return sinon.spy(message)
}

module.exports = {
  startLoggingNoOpts,
  startLogging,
}
