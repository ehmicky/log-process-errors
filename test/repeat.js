import test from 'ava'
import { each } from 'test-each'

import { EVENTS } from './helpers/events.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'
import { stubStackTrace, unstubStackTrace } from './helpers/stack.js'

removeProcessListeners()

each(EVENTS, ({ title }, { eventName, emitMany }) => {
  test.serial(`should not repeat identical events | ${title}`, async (t) => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ spy: true, eventName })

    await emitMany(2)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
