/* eslint-disable max-lines */
import test from 'ava'
import sinon from 'sinon'

import { repeatEvents, repeatEventsLevels } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

repeatEvents((prefix, { name, emitEvent, defaultLevel }) => {
  const OPTIONS = [
    {},
    { level: { default: undefined }, exitOn: [] },
    { level: { default: 'default' }, exitOn: [] },
    { level: { default: () => 'default' } },
  ]
  OPTIONS.forEach(options => {
    test.serial(
      `${prefix} ${JSON.stringify(options)} should use default opts.level()`,
      async t => {
        const { stopLogging, log } = startLogging({
          log: 'spy',
          name,
          ...options,
        })

        await emitEvent()

        t.is(log.firstCall.args[1], defaultLevel)

        stopLogging()
      },
    )
  })

  test.serial(`${prefix} should allow 'silent' level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level: { default: 'silent' },
    })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })

  test.serial(
    `${prefix} should use default opts.level() when using an invalid level`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'invalid' },
        name,
      })

      await emitEvent()

      t.true(log.called)
      t.is(log.firstCall.args[1], defaultLevel)

      stopLogging()
    },
  )

  test.serial(
    `${prefix} should emit a warning when opts.level() uses an invalid level`,
    async t => {
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
      t.snapshot(String(log.lastCall.args[0]))

      stopWarningLog()
      stopLogging()
    },
  )

  test.serial(
    `${prefix} should allow changing log level for a specific event`,
    async t => {
      const { stopLogging, log } = startLogging({
        log: 'spy',
        level: { default: 'error', [name]: 'silent' },
        name,
      })

      await emitEvent()

      t.true(log.notCalled)

      stopLogging()
    },
  )
})

repeatEventsLevels((prefix, { name, emitEvent }, level) => {
  test.serial(`${prefix} should allow changing log level`, async t => {
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

  test.serial(`${prefix} should allow opts.level() as a function`, async t => {
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
    t.true(defaultLevel.firstCall.args[0] instanceof Error)
    t.is(defaultLevel.firstCall.args[0].name.toLowerCase(), name.toLowerCase())
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })
})
/* eslint-enable max-lines */
