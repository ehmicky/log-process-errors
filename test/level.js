/* eslint-disable max-lines */
import test from 'ava'
import testEach from 'test-each'
import sinon from 'sinon'

import { EVENTS } from './helpers/events/main.js'
import { LEVELS } from './helpers/level.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

testEach(
  EVENTS,
  [
    {},
    { level: { default: undefined }, exitOn: [] },
    { level: { default: 'default' }, exitOn: [] },
    { level: { default: () => 'default' } },
  ],
  ({ title }, { eventName, emit, defaultLevel }, options) => {
    test.serial(`should use default opts.level() | ${title}`, async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        eventName,
        ...options,
      })

      await emit()

      t.is(log.firstCall.args[1], defaultLevel)

      stopLogging()
    })
  },
)

testEach(EVENTS, ({ title }, { eventName, emit, defaultLevel }) => {
  test.serial(`should allow 'silent' level | ${title}`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'silent' },
    })

    await emit()

    t.true(log.notCalled)

    stopLogging()
  })

  test.serial(
    `should use default opts.level() when using an invalid level | ${title}`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'invalid' },
        eventName,
      })

      await emit()

      t.true(log.called)
      t.is(log.firstCall.args[1], defaultLevel)

      stopLogging()
    },
  )

  test.serial(
    `should emit a warning when opts.level() uses an invalid level | ${title}`,
    async t => {
      const { stopLogging } = startLogging({
        level: { default: 'invalid' },
        eventName,
      })

      const { stopLogging: stopWarningLog, log } = startLogging({
        log: 'spy',
        eventName: 'warning',
      })

      await emit()

      t.true(log.called)
      t.snapshot(String(log.lastCall.args[0]))

      stopWarningLog()
      stopLogging()
    },
  )

  test.serial(
    `should allow changing log level for a specific event | ${title}`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'error', [eventName]: 'silent' },
        eventName,
      })

      await emit()

      t.true(log.notCalled)

      stopLogging()
    },
  )
})

testEach(EVENTS, LEVELS, ({ title }, { eventName, emit }, level) => {
  test.serial(`should allow changing log level | ${title}`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: level },
      eventName,
    })

    await emit()

    t.is(log.callCount, 1)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  const getLevel = function() {
    return level
  }

  test.serial(`should allow opts.level() as a function | ${title}`, async t => {
    const defaultLevel = sinon.spy(getLevel)

    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: defaultLevel },
      eventName,
    })

    await emit()

    t.is(log.callCount, 1)
    t.is(defaultLevel.callCount, 1)
    t.true(defaultLevel.firstCall.args[0] instanceof Error)
    t.is(
      defaultLevel.firstCall.args[0].name.toLowerCase(),
      eventName.toLowerCase(),
    )
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })
})
/* eslint-enable max-lines */
