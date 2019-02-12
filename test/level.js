'use strict'

const test = require('ava')

const { repeatEvents, repeatEventsLevels, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent, defaultLevel }) => {
  test(`${prefix} should use default opts.level() with undefined`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.deepEqual(log.firstCall.args[1], defaultLevel)

    stopLogging()
  })

  test(`${prefix} should use default opts.level() with function returning undefined`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      eventName,
      level: () => undefined,
    })

    await emitEvent()

    const [, level] = log.firstCall.args
    t.deepEqual(level, defaultLevel)

    stopLogging()
  })

  test(`${prefix} should allow 'silent' level`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', level: 'silent' })

    await emitEvent()

    t.true(log.notCalled)

    stopLogging()
  })

  test(`${prefix} should use default opts.level() when returning an invalid level`, async t => {
    const { stopLogging, log, level } = startLogging({
      log: 'spy',
      level: 'invalid',
      eventName,
    })

    await emitEvent()

    t.true(level.called)
    t.true(log.called)
    t.deepEqual(log.firstCall.args[1], defaultLevel)

    stopLogging()
  })

  test(`${prefix} should emit a warning when opts.level() when returning an invalid level`, async t => {
    const { stopLogging, level } = startLogging({ level: 'invalid', eventName })

    const { stopLogging: stopWarningLog, log } = startLogging({
      log: 'spy',
      eventName: 'warning',
    })

    await emitEvent()

    t.true(level.called)
    t.true(log.called)

    stopWarningLog()
    stopLogging()
  })
})

repeatEventsLevels((prefix, { eventName, emitEvent }, level) => {
  test(`${prefix} should allow changing log level`, async t => {
    const { stopLogging, log, level: levelA } = startLogging({
      log: 'spy',
      level,
      eventName,
    })

    await emitEvent()

    t.true(levelA.called)
    t.is(log.callCount, 1)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  test(`${prefix} should allow string opts.level`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level,
      rawLevel: true,
      eventName,
    })

    await emitEvent()

    t.true(log.called)
    t.is(log.firstCall.args[1], level)

    stopLogging()
  })

  test(`${prefix} should fire opts.level() with info`, async t => {
    const { stopLogging, level: levelA } = startLogging({ level, eventName })

    await emitEvent()

    t.true(levelA.called)
    t.is(typeof levelA.firstCall.args[0], 'object')

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
