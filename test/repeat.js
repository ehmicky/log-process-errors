import test from 'ava'
import testEach from 'test-each'

import { EVENT_DATA } from './helpers/events/main.js'
import { startLogging } from './helpers/init.js'
import { removeProcessListeners } from './helpers/remove.js'
import { stubStackTrace, unstubStackTrace } from './helpers/stack.js'

removeProcessListeners()

testEach(EVENT_DATA, ({ name }, { eventName, emitMany }) => {
  test.serial(`should not repeat identical events | ${name}`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitMany(2)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
