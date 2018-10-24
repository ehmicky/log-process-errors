'use strict'

const process = require('process')

const sinon = require('sinon')

const { forEachEvent, startLogging } = require('./helpers')

const addProcessHandler = function(eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

/* eslint-disable max-nested-callbacks */
forEachEvent(({ eventName, emitEvent, test }) => {
  test('should keep existing process event handlers', async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging } = startLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)

    stopLogging()

    process.off(eventName, processHandler)
  })

  test('should allow disabling logging', async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging, log } = startLogging({ log: 'spy' })

    stopLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)
    t.true(log.notCalled)

    stopLogging()

    process.off(eventName, processHandler)
  })
})
/* eslint-enable max-nested-callbacks */
