'use strict'

const sinon = require('sinon')

const logProcessErrors = require('../../src')
const { mapValues } = require('../../src/utils')

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
const startLoggingNoOpts = function() {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}

const startLogging = function({ name, log, level, message, ...opts } = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level, name })
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

// If `event.name` is specified, only print those events
const getLevel = function({ level, name }) {
  if (name === undefined) {
    return level
  }

  const levelA = level === undefined ? { default: 'default' } : level

  return mapValues(levelA, levelB => onlyEvent.bind(null, levelB, name))
}

const onlyEvent = function(level, name, event) {
  if (event.name !== name) {
    return 'silent'
  }

  if (typeof level !== 'function') {
    return level
  }

  return level(event)
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
