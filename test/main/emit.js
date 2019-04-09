import test from 'ava'

import { repeatEvents } from '../helpers/repeat.js'
import { startLogging } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

repeatEvents((prefix, { emitEvent }) => {
  test(`${prefix} events emitters should exist`, t => {
    t.is(typeof emitEvent, 'function')
  })

  test(`${prefix} events emitters should not throw`, async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emitEvent)

    stopLogging()
  })
})
