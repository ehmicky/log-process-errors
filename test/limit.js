'use strict'

const test = require('ava')

// Required directly because this is exposed through documentation, but not
// through code
// eslint-disable-next-line import/no-internal-modules
const { MAX_EVENTS } = require('../src/constants')

const {
  repeatEvents,
  startLogging,
  stubStackTraceRandom,
  unstubStackTrace,
  emitEvents,
} = require('./helpers')

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should limit events`, async t => {
    stubStackTraceRandom()

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: onlyNotLimitedWarning.bind(null, name) },
    })

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
      level: { default: onlyLimited },
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
      level: { default: onlyLimited },
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

const onlyLimited = function(event) {
  if (!isLimitedWarning(event)) {
    return 'silent'
  }
}

const onlyNotLimitedWarning = function(name, event) {
  if (isLimitedWarning(event) || event.name !== name) {
    return 'silent'
  }
}

const isLimitedWarning = function({ name, value = {} }) {
  return name === 'warning' && value.name === 'LogProcessErrors'
}
