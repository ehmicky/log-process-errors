import process from 'process'

import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, EVENTS_MAP } from './helpers/events.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

const addProcessHandler = function (eventName) {
  const processHandler = sinon.spy()
  process.on(eventName, processHandler)
  return processHandler
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

each(EVENTS, ({ title }, { eventName, emit }) => {
  test.serial(
    `should keep existing process event handlers | ${title}`,
    async (t) => {
      if (eventName === 'warning') {
        return t.pass()
      }

      const processHandler = addProcessHandler(eventName)

      const { stopLogging } = startLogging()

      t.true(processHandler.notCalled)

      await emit()

      t.true(processHandler.called)

      stopLogging()

      process.off(eventName, processHandler)
    },
  )

  // eslint-disable-next-line max-statements
  test.serial(`should allow disabling logging | ${title}`, async (t) => {
    if (eventName === 'rejectionHandled') {
      return t.pass()
    }

    const processHandler = addProcessHandler(eventName)

    const { stopLogging, log } = startLogging({ spy: true })

    stopLogging()

    t.true(processHandler.notCalled)

    await emit()

    t.true(processHandler.called)
    t.true(log.notCalled)

    stopLogging()

    process.off(eventName, processHandler)
  })
})
