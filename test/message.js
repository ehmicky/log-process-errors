'use strict'

const test = require('ava')

const { startLogging, repeatEvents, repeatEventsLevels } = require('./helpers')

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should allow customizing log message`, async t => {
    const { stopLogging, log, message } = startLogging({
      log: 'spy',
      message: 'message',
      name,
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
      name,
    })

    await emitEvent()

    t.true(log.calledOnce)
    t.is(log.firstCall.args[0], 'true')

    stopLogging()
  })
})

repeatEventsLevels((prefix, { name, emitEvent }, level) => {
  test(`${prefix} should fire opts.message() with arguments`, async t => {
    const { stopLogging, message } = startLogging({
      message: 'message',
      level: { default: level },
      name,
    })

    await emitEvent()

    t.true(message.calledOnce)
    t.snapshot(message.firstCall.args)

    stopLogging()
  })
})
