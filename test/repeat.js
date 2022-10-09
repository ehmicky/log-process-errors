import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, { emitMany, eventName }) => {
  test.serial(`should not repeat identical events | ${title}`, async (t) => {
    const log = sinon.spy()
    const stopLogging = logProcessErrors({ log, exit: false })

    t.is(log.callCount, 0)
    await emitMany(2)
    t.is(log.callCount, eventName === 'rejectionHandled' ? 2 : 1)

    stopLogging()
  })
})
