'use strict'

const sinon = require('sinon')

const logProcessErrors = require('../..')

const { mapValues } = require('./utils')

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
const startLoggingNoOpts = function() {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}

const startLogging = function({
  eventName,
  log,
  level,
  message,
  ...opts
} = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level, eventName })
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

// If `eventName` is specified, only print those events
const getLevel = function({ level, eventName }) {
  if (eventName === undefined) {
    return level
  }

  const levelA = level === undefined ? { default: undefined } : level

  return mapValues(levelA, levelB => onlyEvent.bind(null, levelB, eventName))
}

const onlyEvent = function(level, eventName, info) {
  if (info.eventName !== eventName) {
    return 'silent'
  }

  if (typeof level !== 'function') {
    return level
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
