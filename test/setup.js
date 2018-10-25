'use strict'

const process = require('process')

const test = require('ava')
const sinon = require('sinon')

const { repeatEvents, startLogging } = require('./helpers')

const addProcessHandler = function(eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

/* eslint-disable max-nested-callbacks */
repeatEvents((prefix, { eventName, emitEvent }) => {
  test(`${prefix} should keep existing process event handlers`, async t => {
    const processHandler = addProcessHandler(eventName)

    const { stopLogging } = startLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)

    stopLogging()

    process.off(eventName, processHandler)
  })

  test(`${prefix} should allow disabling logging`, async t => {
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
