import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emit } from './helpers/events.js'
import { setProcessEvent, unsetProcessEvent } from './helpers/process.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

test.serial('should allow disabling logging', async (t) => {
  const processHandler = setProcessEvent('warning')
  const onError = sinon.spy()
  const stopLogging = logProcessErrors({ onError })
  stopLogging()

  t.false(processHandler.called)
  await emit('warning')
  t.false(onError.called)
  t.true(processHandler.called)

  unsetProcessEvent('warning', processHandler)
})

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should keep existing process event handlers | ${title}`,
    async (t) => {
      const processHandler = setProcessEvent(eventName)
      const onError = sinon.spy()
      const stopLogging = logProcessErrors({ onError, exit: false })

      t.false(processHandler.called)
      t.false(onError.called)
      await emit(eventName)
      t.true(onError.called)
      t.true(processHandler.called)

      stopLogging()
      unsetProcessEvent(eventName, processHandler)
    },
  )
})
