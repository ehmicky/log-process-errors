import process from 'process'

import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emit } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const setProcessEvent = function (eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
}

const unsetProcessEvent = function (eventName, processHandler) {
  process.off(eventName, processHandler)
}

test.serial('should allow disabling logging', async (t) => {
  const processHandler = setProcessEvent('warning')
  const log = sinon.spy()
  const stopLogging = logProcessErrors({ log })
  stopLogging()

  t.false(processHandler.called)
  await emit('warning')
  t.false(log.called)
  t.true(processHandler.called)

  unsetProcessEvent('warning', processHandler)
})

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should keep existing process event handlers | ${title}`,
    async (t) => {
      const processHandler = setProcessEvent(eventName)
      const log = sinon.spy()
      const stopLogging = logProcessErrors({ log, exit: false })

      t.false(processHandler.called)
      t.false(log.called)
      await emit(eventName)
      t.true(log.called)
      t.true(processHandler.called)

      stopLogging()
      unsetProcessEvent(eventName, processHandler)
    },
  )
})
