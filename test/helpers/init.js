import mapObj from 'map-obj'
import sinon from 'sinon'

import logProcessErrors from '../../src/main.js'

// Call `logProcessErrors()` then return spied objects and `stopLogging()`
export const startLogging = function ({ eventName, log, level, ...opts } = {}) {
  const logA = getLog({ log })
  const levelA = getLevel({ level, eventName })

  const stopLogging = logProcessErrors({
    log: logA,
    level: levelA,
    exitOn: [],
    ...opts,
  })
  return { stopLogging, log: logA, level: levelA }
}

// Get `opts.log()`
const getLog = function ({ log }) {
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
const noop = function () {}

// If `eventName` is specified, only print those events
const getLevel = function ({ level, eventName }) {
  if (eventName === undefined) {
    return level
  }

  const levelA = level === undefined ? { default: 'default' } : level

  return mapObj(levelA, (key, levelB) => [
    key,
    onlyEvent.bind(null, levelB, eventName),
  ])
}

const onlyEvent = function (level, eventName, error) {
  if (error.name.toLowerCase() !== eventName.toLowerCase()) {
    return 'silent'
  }

  if (typeof level !== 'function') {
    return level
  }

  return level(error)
}

export const startLoggingNoOpts = function () {
  const stopLogging = logProcessErrors()
  return { stopLogging }
}
