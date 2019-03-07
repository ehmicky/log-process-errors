/* eslint-disable max-lines, max-lines-per-function */
'use strict'

const test = require('ava')
const sinon = require('sinon')

const {
  repeatEvents,
  repeatEventsLevels,
  startLogging,
  stubStackTrace,
  unstubStackTrace,
  normalizeMessage,
} = require('./helpers')

repeatEvents((prefix, { name, emitEvent, defaultLevel }) => {
  const OPTIONS = [
    {},
    { level: { default: undefined }, exitOn: [] },
    { level: { default: 'default' }, exitOn: [] },
    { level: { default: () => 'default' } },
  ]
  OPTIONS.forEach(options => {
    test(`${prefix} ${JSON.stringify(
      options,
    )} should use default opts.level()`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        name,
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
      name,
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
      name,
    })

    const { stopLogging: stopWarningLog, log } = startLogging({
      log: 'spy',
      name: 'warning',
    })

    await emitEvent()

    t.true(log.called)
    t.snapshot(normalizeMessage(log.lastCall.args[0], { colors: false }))

    stopWarningLog()
    stopLogging()

    unstubStackTrace()
  })

  test(`${prefix} should allow changing log level for a specific event`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'error', [name]: 'silent' },
      name,
    })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })
})

repeatEventsLevels((prefix, { name, emitEvent }, level) => {
  test(`${prefix} should allow changing log level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: level },
      name,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  test(`${prefix} should allow opts.level() as a function`, async t => {
    // eslint-disable-next-line max-nested-callbacks
    const defaultLevel = sinon.spy(() => level)

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: defaultLevel },
      name,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.is(defaultLevel.callCount, 1)
    t.is(typeof defaultLevel.firstCall.args[0], 'object')
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })
})
/* eslint-enable max-lines, max-lines-per-function */
