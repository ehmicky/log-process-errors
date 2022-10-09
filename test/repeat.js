import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS, emitMany } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, eventName) => {
  test.serial(`should not repeat identical events | ${title}`, async (t) => {
    const log = sinon.spy()
    const stopLogging = logProcessErrors({ log, exit: false })

    t.is(log.callCount, 0)
    await emitMany(eventName, 2)
    t.is(log.callCount, eventName === 'rejectionHandled' ? 2 : 1)

    stopLogging()
  })

  test.serial(
    `can repeat identical events between different loggers | ${title}`,
    async (t) => {
      const log = sinon.spy()
      const stopLoggingOne = logProcessErrors({ log })
      const stopLoggingTwo = logProcessErrors({ log })

      t.is(log.callCount, 0)
      await emitMany(eventName, 2)
      t.is(log.callCount, 2 * (eventName === 'rejectionHandled' ? 2 : 1))

      stopLoggingOne()
      stopLoggingTwo()
    },
  )
})
