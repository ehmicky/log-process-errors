import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emitValue } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should normalize errors passed to onError() | ${title}`,
    async (t) => {
      const onError = sinon.spy()
      const stopLogging = logProcessErrors({ onError, exit: false })

      const message = 'message'
      await emitValue(() => message, eventName)
      t.true(onError.args[0][0] instanceof Error)
      t.true(onError.args[0][0].message.startsWith(message))

      stopLogging()
    },
  )
})
