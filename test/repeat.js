import test from 'ava'

import { repeatEvents } from './helpers/repeat.js'
import { startLogging } from './helpers/init.js'
import { emitEvents } from './helpers/several.js'
import { stubStackTrace, unstubStackTrace } from './helpers/stack.js'
import { removeProcessListeners } from './helpers/remove.js'

removeProcessListeners()

repeatEvents((prefix, { name, emitEvent }) => {
  test(`${prefix} should not repeat identical events`, async t => {
    stubStackTrace()

    const { stopLogging, log } = startLogging({ log: 'spy', name })

    await emitEvents(2, emitEvent)

    t.is(log.callCount, 1)

    stopLogging()

    unstubStackTrace()
  })
})
