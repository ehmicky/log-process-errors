import test from 'ava'

import { repeat } from '../helpers/data_driven/main.js'
import { EVENT_DATA } from '../helpers/repeat.js'
import { startLogging } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

repeat(EVENT_DATA, ({ name }, { emitEvent }) => {
  test(`${name} events emitters should exist`, t => {
    t.is(typeof emitEvent, 'function')
  })

  test(`${name} events emitters should not throw`, async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emitEvent)

    stopLogging()
  })
})
