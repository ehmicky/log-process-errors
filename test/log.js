'use strict'

const sinon = require('sinon')
const test = require('ava')

const { repeatEvents, repeatEventsLevels, startLogging } = require('./helpers')

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should fire opts.log()`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy' })

    t.true(log.notCalled)

    await emitEvent()

    t.true(log.called)

    stopLogging()
  })

  test(`${prefix} should fire opts.log() once`, async t => {
    const { stopLogging, log } = startLogging({ log: 'spy', name })

    t.true(log.notCalled)

    await emitEvent()

    t.is(log.callCount, 1)

    stopLogging()
  })

  test(`${prefix} should fire opts.log() with arguments`, async t => {
    const { stopLogging, log } = startLogging({
      log: 'spy',
      message: 'message',
      name,
    })

    await emitEvent()

    t.is(log.callCount, 1)
    t.snapshot(log.firstCall.args)

    stopLogging()
  })
})

repeatEventsLevels((prefix, { name, emitEvent }, level) => {
  test(`${prefix} should log on the console by default`, async t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, level)

    const { stopLogging } = startLogging({
      log: 'default',
      message: 'message',
      level: { default: level },
      name,
    })

    await emitEvent()

    t.is(stub.callCount, 1)
    t.is(stub.firstCall.args[0], 'message')

    stopLogging()

    stub.restore()
  })
})
