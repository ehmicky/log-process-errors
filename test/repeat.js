import test from 'ava'

import { testEach } from './helpers/data_driven/main.js'
import { EVENT_DATA } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { emitEvents } from './helpers/several.js'
import { removeProcessListeners } from './helpers/remove.js'
import { stubStackTrace, unstubStackTrace } from './helpers/stack.js'

removeProcessListeners()

testEach(EVENT_DATA, ({ name }, { eventName, emitEvent }) => {
  test.serial(`${name} should not repeat identical events`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', eventName })

    await emitEvents(2, emitEvent)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
