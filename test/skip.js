'use strict'

const sinon = require('sinon')

const { forEachEvent, startLogging } = require('./helpers')

/* eslint-disable max-nested-callbacks */
forEachEvent(({ emitEvent, test }) => {
  test('should allow skipping events', async t => {
    const skipEvent = sinon.spy(() => true)
    const { stopLogging, log } = startLogging({ log: 'spy', skipEvent })

    await emitEvent()

    t.true(skipEvent.called)
    t.true(log.notCalled)

    stopLogging()
  })

  test('should fire opts.skipEvent() with info', async t => {
    const skipEvent = sinon.spy(() => true)
    const { stopLogging } = startLogging({ skipEvent })

    await emitEvent()

    t.is(typeof skipEvent.firstCall.args[0], 'object')

    stopLogging()
  })
})
/* eslint-enable max-nested-callbacks */
