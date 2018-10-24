'use strict'

const sinon = require('sinon')

const { forEachEvent, forEachEventLevel, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should fire opts.log()', async t => {
    const { stopLogging, log } = startLogging({ log: 'spy' })

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()
  })

  test('should fire opts.log() once', async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    t.true(log.notCalled)

    await emitEvent()

    t.is(log.callCount, 1)

    stopLogging()
  })

  test('should fire opts.log() with message', async t => {
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

  test('should fire opts.log() with info', async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvent()

    t.is(typeof log.firstCall.args[2], 'object')

    stopLogging()
  })
})

forEachEventLevel(({ eventName, emitEvent, level, test }) => {
  test('should fire opts.log() with level', async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      level,
      eventName,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.true(typeof log.firstCall.args[1] === 'string')

    stopLogging()
  })

  test('should log on the console by default', async t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, level)

    const { stopLogging } = startLogging({
      log: 'default',
      message: 'message',
      level,
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
