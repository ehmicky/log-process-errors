'use strict'

const chalk = require('chalk')

const { forEachEvent, forEachEventLevel, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should allow customizing log message', async t => {
    const { stopLogging, log, getMessage } = startLogging({
      log: 'spy',
      message: 'message',
      eventName,
    })

    await emitEvent()

    t.true(getMessage.calledOnce)
    t.true(log.calledOnce)
    t.is(log.firstCall.args[0], 'message')

    stopLogging()
  })

  test('should stringify opts.getMessage() return value', async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      message: true,
      eventName,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.is(log.firstCall.args[0], 'true')

    stopLogging()
  })
})

forEachEventLevel(({ eventName, emitEvent, level, test }) => {
  test('should fire opts.getMessage() with info', async t => {
    const { stopLogging, getMessage } = startLogging({
      message: 'message',
      level,
      eventName,
    })

    await emitEvent()

    t.true(getMessage.calledOnce)
    t.is(typeof getMessage.firstCall.args[0], 'object')
    t.is(getMessage.firstCall.args[0].level, level)
    t.true(getMessage.firstCall.args[0].colors instanceof chalk.constructor)

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
