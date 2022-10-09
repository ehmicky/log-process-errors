import process from 'process'

import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, EVENTS_MAP } from './helpers/events.js'
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

test.serial('should work with no options', async (t) => {
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')
  const stopLogging = logProcessErrors()

  t.false(stub.called)
  await EVENTS_MAP.warning.emit()
  t.true(stub.called)

  stopLogging()
  stub.restore()
})

test.serial('should allow disabling logging', async (t) => {
  const processHandler = setProcessEvent('warning')
  // eslint-disable-next-line no-restricted-globals
  const stub = sinon.stub(console, 'error')
  const stopLogging = logProcessErrors()
  stopLogging()

  t.false(processHandler.called)
  await EVENTS_MAP.warning.emit()
  t.false(stub.called)
  t.true(processHandler.called)

  stub.restore()
  unsetProcessEvent('warning', processHandler)
})

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(
    `should keep existing process event handlers | ${title}`,
    async (t) => {
      const processHandler = setProcessEvent(eventName)
      // eslint-disable-next-line no-restricted-globals
      const stub = sinon.stub(console, 'error')
      const stopLogging = logProcessErrors({ exit: false })

      t.false(processHandler.called)
      t.false(stub.called)
      await emit()
      t.true(stub.called)
      t.true(processHandler.called)

      stopLogging()
      stub.restore()
      unsetProcessEvent(eventName, processHandler)
    },
  )
})
