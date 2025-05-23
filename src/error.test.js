import test from 'ava'
import { each } from 'test-each'

import { emit, emitValue, EVENTS } from './helpers/events.test.js'
import { removeProcessListeners } from './helpers/remove.test.js'
import { startLogging } from './helpers/start.test.js'

each(EVENTS, ({ title }, eventName) => {
  test.serial(
    `should normalize errors passed to onError() | ${title}`,
    async (t) => {
      const { onError, stopLogging } = startLogging()

      const message = 'message'
      await emitValue(message, eventName)
      const [[error]] = onError.args
      t.true(error instanceof Error)
      t.true(error.message.startsWith(message))

      stopLogging()
    },
  )

  test.serial(`should append a description to error | ${title}`, async (t) => {
    const { onError, stopLogging } = startLogging()

    await emit(eventName)
    const [[error]] = onError.args
    t.true(error.stack.includes(error.message))
    t.snapshot(error.message)

    stopLogging()
  })
})

removeProcessListeners()
