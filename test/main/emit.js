import test from 'ava'
import testEach from 'test-each'

import { EVENT_DATA } from '../helpers/events/main.js'
import { startLogging } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

testEach(EVENT_DATA, ({ name }, { emitEvent }) => {
  test(`events emitters should exist | ${name}`, t => {
    t.is(typeof emitEvent, 'function')
  })

  test(`events emitters should not throw | ${name}`, async t => {
    const { stopLogging } = startLogging()

    await t.notThrowsAsync(emitEvent)

    stopLogging()
  })
})
