import test from 'ava'
import logProcessErrors from 'log-process-errors'
import sinon from 'sinon'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

each(EVENTS, ({ title }, { emit }) => {
  test.serial.only(
    `should not repeat identical events | ${title}`,
    async (t) => {
      const log = sinon.spy()
      const stopLogging = logProcessErrors({ log, exit: false })

      t.is(log.callCount, 0)
      await emit()
      t.is(log.callCount, 1)
      await emit()
      t.is(log.callCount, 1)

      stopLogging()
    },
  )
})
