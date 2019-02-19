'use strict'

const sinon = require('sinon')
const test = require('ava')

const { repeatEvents, repeatEventsLevels, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should fire opts.log()`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy' })

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()
  })

  test(`${prefix} should fire opts.log() once`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    t.true(log.notCalled)

    await emitEvent()

    t.is(log.callCount, 1)

    stopLogging()
  })

  test(`${prefix} should fire opts.log() with message`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      message: 'message',
      eventName,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.is(log.firstCall.args[0], 'message')

    stopLogging()
  })

  test(`${prefix} should fire opts.log() with info`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    const [, , info] = log.firstCall.args
    t.is(typeof info, 'object')

    stopLogging()
  })
})

repeatEventsLevels((prefix, { eventName, emitEvent }, level) => {
  test(`${prefix} should log on the console by default`, async t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, level)

    const { stopLogging } = startLogging({
      log: 'default',
      message: 'message',
      level: { default: level },
      eventName,
    })

    await emitEvent()

    t.is(stub.callCount, 1)
    t.is(stub.firstCall.args[0], 'message')

    stopLogging()

    stub.restore()
  })
})
/* eslint-enable max-nested-callbacks */
