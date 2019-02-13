/* eslint-disable max-lines */
'use strict'

const test = require('ava')
const sinon = require('sinon')

const {
  repeatEvents,
  repeatEventsLevels,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
} = require('./helpers')

/* eslint-disable max-nested-callbacks, max-lines-per-function */
repeatEvents((prefix, { eventName, emitEvent, defaultLevel }) => {
  const OPTIONS = [
    {},
    { level: { default: undefined }, exitOn: [] },
    { level: { default: () => undefined } },
  ]
  OPTIONS.forEach(options => {
    test(`${prefix} ${JSON.stringify(
      options,
    )} should use default opts.level()`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        eventName,
        ...options,
      })

      await emitEvent()

      t.is(log.firstCall.args[1], defaultLevel)

      stopLogging()
    })
  })

  test(`${prefix} should allow 'silent' level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'silent' },
    })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })

  test(`${prefix} should use default opts.level() when using an invalid level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'invalid' },
      eventName,
    })

    await emitEvent()

    t.true(log.called)
    t.is(log.firstCall.args[1], defaultLevel)

    stopLogging()
  })

  test(`${prefix} should emit a warning when opts.level() uses an invalid level`, async t => {
    stubStackTrace()

    const { stopLogging } = startLogging({
      level: { default: 'invalid' },
      eventName,
    })

    const { stopLogging: stopWarningLog, log } = startLogging({
      log: 'spy',
      eventName: 'warning',
    })

    await emitEvent()

    t.true(log.called)
    t.snapshot(log.lastCall.args[0])

    stopWarningLog()
    stopLogging()

    unstubStackTrace()
  })

  test(`${prefix} should allow changing log level for a specific event`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'error', [eventName]: 'silent' },
      eventName,
    })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })
})

repeatEventsLevels((prefix, { eventName, emitEvent }, level) => {
  test(`${prefix} should allow changing log level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: level },
      eventName,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  test(`${prefix} should allow opts.level() as a function`, async t => {
    const defaultLevel = sinon.spy(() => level)

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: defaultLevel },
      eventName,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.is(defaultLevel.callCount, 1)
    t.is(typeof defaultLevel.firstCall.args[0], 'object')
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks, max-lines-per-function */
/* eslint-enable max-lines */
