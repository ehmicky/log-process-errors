import test from 'ava'
import { each } from 'test-each'

import { EVENTS, emit } from './helpers/events.js'
import { setProcessEvent, unsetProcessEvent } from './helpers/process.js'
import { removeProcessListeners } from './helpers/remove.js'
import { startLogging } from './helpers/start.js'

removeProcessListeners()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should allow disabling logging | ${eventName}`, async (t) => {
    if (eventName === 'rejectionHandled') {
      return t.pass()
    }

    const processHandler = setProcessEvent(eventName)
    const { onError, stopLogging } = startLogging()
    stopLogging()

    t.false(processHandler.called)
    await emit(eventName)
    t.false(onError.called)
    t.true(processHandler.called)

    unsetProcessEvent(eventName, processHandler)
  })

  test.serial(
    `should keep existing process event handlers | ${title}`,
    async (t) => {
      const processHandler = setProcessEvent(eventName)
      const { onError, stopLogging } = startLogging()

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
