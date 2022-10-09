import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emit, emitValue } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should normalize errors passed to onError() | ${title}`,
    async (t) => {
      const onError = sinon.spy()
      const stopLogging = logProcessErrors({ onError, exit: false })

      const message = 'message'
      await emitValue(message, eventName)
      const [[error]] = onError.args
      t.true(error instanceof Error)
      t.true(error.message.startsWith(message))

      stopLogging()
    },
  )

  test.serial(`should append a description to error | ${title}`, async (t) => {
    const onError = sinon.spy()
    const stopLogging = logProcessErrors({ onError, exit: false })

    await emit(eventName)
    const [[error]] = onError.args
    t.true(error.stack.includes(error.message))
    t.snapshot(error.message)

    stopLogging()
  })
})
