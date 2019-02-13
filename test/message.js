'use strict'

const test = require('ava')
const chalk = require('chalk')

const { startLogging, repeatEvents, repeatEventsLevels } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should allow customizing log message`, async t => {
    const { stopLogging, log, message } = startLogging({
      log: 'spy',
      message: 'message',
      eventName,
    })

    await emitEvent()

    t.true(message.calledOnce)
    t.true(log.calledOnce)
    t.is(log.firstCall.args[0], 'message')

    stopLogging()
  })

  test(`${prefix} should stringify opts.message() return value`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      message: () => true,
      eventName,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.is(log.firstCall.args[0], 'true')

    stopLogging()
  })
})

repeatEventsLevels((prefix, { eventName, emitEvent }, level) => {
  test(`${prefix} should fire opts.message() with info`, async t => {
    const { stopLogging, message } = startLogging({
      message: 'message',
      level: { default: level },
      eventName,
    })

    await emitEvent()

    t.true(message.calledOnce)
    t.is(typeof message.firstCall.args[0], 'object')
    t.is(message.firstCall.args[0].level, level)
    t.is(
      message.firstCall.args[0].colors.constructor.name,
      chalk.constructor.name,
    )

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
