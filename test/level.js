/* eslint-disable max-lines */
import test from 'ava'
import sinon from 'sinon'

import { testEach } from './helpers/data_driven/main.js'
import { EVENT_DATA, NORMAL_LEVELS } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

testEach(EVENT_DATA, ({ name }, { eventName, emitEvent, defaultLevel }) => {
  const OPTIONS = [
    {},
    { level: { default: undefined }, exitOn: [] },
    { level: { default: 'default' }, exitOn: [] },
    { level: { default: () => 'default' } },
  ]
  OPTIONS.forEach(options => {
    test.serial(
      `${name} ${JSON.stringify(options)} should use default opts.level()`,
      async t => {
        const { stopLogging, log } = startLogging({
          log: 'spy',
          eventName,
          ...options,
        })

        await emitEvent()

        t.is(log.firstCall.args[1], defaultLevel)

        stopLogging()
      },
    )
  })

  test.serial(`${name} should allow 'silent' level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'silent' },
    })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })

  test.serial(
    `${name} should use default opts.level() when using an invalid level`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'invalid' },
        eventName,
      })

      await emitEvent()

      t.true(log.called)
      t.is(log.firstCall.args[1], defaultLevel)

      stopLogging()
    },
  )

  test.serial(
    `${name} should emit a warning when opts.level() uses an invalid level`,
    async t => {
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
      t.snapshot(String(log.lastCall.args[0]))

      stopWarningLog()
      stopLogging()
    },
  )

  test.serial(
    `${name} should allow changing log level for a specific event`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'error', [eventName]: 'silent' },
        eventName,
      })

      await emitEvent()

      t.true(log.notCalled)

      stopLogging()
    },
  )
})

testEach(
  EVENT_DATA,
  NORMAL_LEVELS,
  ({ name }, { eventName, emitEvent }, level) => {
    test.serial(`${name} should allow changing log level`, async t => {
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

    const getLevel = function() {
      return level
    }

    test.serial(`${name} should allow opts.level() as a function`, async t => {
      const defaultLevel = sinon.spy(getLevel)

      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: defaultLevel },
        eventName,
      })

      await emitEvent()

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
  },
)
/* eslint-enable max-lines */
