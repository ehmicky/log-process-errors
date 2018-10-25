'use strict'

const test = require('ava')

// eslint-disable-next-line import/no-internal-modules
const { MAX_EVENTS } = require('../src/limit')

const {
  repeatEvents,
  startLogging,
  stubStackTraceRandom,
  unstubStackTrace,
  emitEvents,
} = require('./helpers')

const isLimitedWarning = function({ eventName, error: { name } = {} }) {
  return eventName === 'warning' && name === 'LogProcessError'
}

const isNotLimitedWarning = function(info) {
  return !isLimitedWarning(info)
}

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should limit events`, async t => {
    stubStackTraceRandom()

    const skipEvent = info =>
      info.eventName !== eventName || isLimitedWarning(info)
    const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

    await emitEvents(MAX_EVENTS, emitEvent)

    t.is(log.callCount, MAX_EVENTS)

    await emitEvent()

    t.is(log.callCount, MAX_EVENTS)

    stopLogging()

    unstubStackTrace()
  })

  test(`${prefix} should emit warning when limiting events`, async t => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      skipEvent: isNotLimitedWarning,
    })

    await emitEvents(MAX_EVENTS, emitEvent)

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()

    unstubStackTrace()
  })

  test(`${prefix} should only emit warning once when limiting events`, async t => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      skipEvent: isNotLimitedWarning,
      log: 'spy',
    })

    await emitEvents(MAX_EVENTS, emitEvent)

    await emitEvent()

    const { callCount } = log

    await emitEvent()

    t.is(log.callCount, callCount)

    stopLogging()

    unstubStackTrace()
  })
})
/* eslint-enable max-nested-callbacks */
