'use strict'

const test = require('ava')

const { repeatEvents, repeatEventsLevels, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent, defaultLevel }) => {
  test(`${prefix} should use default opts.getLevel()`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.deepEqual(log.firstCall.args[1], defaultLevel)

    stopLogging()
  })

  test(`${prefix} should use default opts.getLevel() when returning a valid level`, async t => {
    const { stopLogging, log, getLevel } = startLogging({
      log: 'spy',
      level: 'invalid',
      eventName,
    })

    await emitEvent()

    t.true(getLevel.called)
    t.true(log.called)
    t.deepEqual(log.firstCall.args[1], defaultLevel)

    stopLogging()
  })

  test(`${prefix} should emit a warning when opts.getLevel() when returns a valid level`, async t => {
    const { stopLogging, getLevel } = startLogging({
      level: 'invalid',
      eventName,
    })

    const { stopLogging: stopWarningLog, log } = startLogging({
      log: 'spy',
      eventName: 'warning',
    })

    await emitEvent()

    t.true(getLevel.called)
    t.true(log.called)

    stopWarningLog()
    stopLogging()
  })
})

repeatEventsLevels((prefix, { eventName, emitEvent }, level) => {
  test(`${prefix} should allow changing log level`, async t => {
    const { stopLogging, log, getLevel } = startLogging({
      log: 'spy',
      level,
      eventName,
    })

    await emitEvent()

    t.is(getLevel.callCount, 1)
    t.is(log.callCount, 1)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  test(`${prefix} should fire opts.getLevel() with info`, async t => {
    const { stopLogging, getLevel } = startLogging({ level, eventName })

    await emitEvent()

    t.true(getLevel.called)
    t.is(typeof getLevel.firstCall.args[0], 'object')

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
