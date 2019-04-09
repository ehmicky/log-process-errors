import sinon from 'sinon'

import logProcessErrors from '../../src/main.js'
import { mapValues } from '../../src/utils.js'

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
export const startLoggingNoOpts = function() {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}

export const startLogging = function({ name, log, level, ...opts } = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level, name })

  const stopLogging = logProcessErrors({
    log: logA,
    level: levelA,
    exitOn: [],
    ...opts,
  })
  return { stopLogging, log: logA, level: levelA }
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

// If `name` is specified, only print those events
const getLevel = function({ level, name }) {
  if (name === undefined) {
    return level
  }

  const levelA = level === undefined ? { default: 'default' } : level

  return mapValues(levelA, levelB => onlyEvent.bind(null, levelB, name))
}

const onlyEvent = function(level, name, error) {
  if (error.name.toLowerCase() !== name.toLowerCase()) {
    return 'silent'
  }

  if (typeof level !== 'function') {
    return level
  }

  return level(error)
}
